import path from 'path';
import Discord from 'discord.js';
import { PersistentState } from '../../../lib/PersistentState';
import {
  LiveUpdate,
  StreamQuery,
  LiveStreamInfo,
  getTwitchUpdate,
} from './twitch';

type LiveState = { [K in string]: LiveStreamInfo };

class StreamPoller {
  private liveState: LiveState = {};
  persist: boolean;
  persistentState: PersistentState<LiveState>;
  updateFilter: (l: LiveUpdate) => LiveUpdate;
  maxOfflineUpdates = 5;
  offlineUpdates: Record<string, number> = {};

  constructor(persistentStatePath?: string) {
    if (persistentStatePath !== undefined) {
      this.persist = true;
      this.persistentState = new PersistentState(persistentStatePath, {
        defaultState: this.liveState,
        writePretty: true,
      });
      this.liveState = this.persistentState.get();
    }

    this.updateLiveState = this.updateLiveState.bind(this);
  }

  // diffs `liveState` with `update`, and returns a `LiveUpdate` that contains
  // only new streams.
  updateLiveState(update: LiveUpdate): LiveUpdate {
    const { liveState, maxOfflineUpdates, offlineUpdates } = this;
    const streams = this.updateFilter ? this.updateFilter(update) : update;

    // remove streams that have gone offline from the state
    for (const userId in liveState) {
      const userStream = streams.find(s => s.userId === userId);

      // if an active stream has gone offline, increment its
      // value in `offlineUpdates`.
      if (userStream === undefined) {
        if (offlineUpdates[userId] === undefined) {
          offlineUpdates[userId] = 1;
        } else {
          offlineUpdates[userId] += 1;
        }

        // stream has reached the offline update cap; time to remove it
        if (offlineUpdates[userId] > maxOfflineUpdates) {
          delete liveState[userId];
          delete offlineUpdates[userId];
        }
      } else {
        // if an active stream is online, reset its value in
        // `offlineUpdates` to 0.
        offlineUpdates[userId] = 0;
      }
    }

    // add streams that have gone online to the state and the result
    const result = streams.filter(stream => !liveState[stream.userId]);
    streams.forEach(stream => (liveState[stream.userId] = stream));

    if (this.persist) {
      this.persistentState.set(liveState);
    }

    return result;
  }

  pollLiveStreams(query: StreamQuery): Promise<LiveUpdate> {
    return getTwitchUpdate(query).then(this.updateLiveState);
  }
}

const filterLiveUpdate = (isGameWhitelisted: (game: string) => boolean) => (
  update: LiveUpdate,
): LiveUpdate =>
  update.filter(
    stream => stream.game && isGameWhitelisted(stream.game.toLowerCase()),
  );

const twitchUrl = (stream: LiveStreamInfo): string =>
  `https://www.twitch.tv/${stream.username}`;

const embedStreamInfo = (
  stream: LiveStreamInfo,
  flavor?: string,
): Discord.MessageEmbed => {
  const result = new Discord.MessageEmbed()
    .setURL(twitchUrl(stream))
    .setAuthor(`${stream.username} is live!`)
    .setTitle(stream.title)
    .setDescription(`playing ${stream.game}`)
    .setColor('#7289da')
    .setThumbnail(stream.avatarUrl)
    .setTimestamp();

  if (flavor !== undefined) result.addField('\u200b', flavor);

  return result;
};

type Sender = (msg: string, embed: Discord.MessageEmbed) => any;

const sendLiveUpdate = (
  send: Sender,
  update: LiveUpdate,
  getFlavor?: () => string,
): void => {
  update.forEach((stream: LiveStreamInfo) => {
    const flavor = getFlavor && getFlavor();
    send(`now live: ${twitchUrl(stream)}`, embedStreamInfo(stream, flavor));
  });
};

const getTargetChannel = (
  client: Discord.Client,
  config: NotificationConfig,
): Maybe<Discord.TextChannel> => {
  const guild = client.guilds.resolve(config.guildId);

  if (guild !== null) {
    return guild.channels.resolve(config.channelId) as Discord.TextChannel;
  }
};

export interface NotificationConfig {
  guildId: string;
  channelId: string;
  updateInterval: number;
  query: StreamQuery;
  isGameWhitelisted?: (game: string) => boolean;
  persist?: boolean;
  getFlavor?: () => string;
}

export const onReady = (
  client: Discord.Client,
  config: NotificationConfig,
): void => {
  const { updateInterval, query, persist = true } = config;

  const statePath = persist
    ? path.join(__dirname, `live-state-${config.guildId}.json`)
    : undefined;

  const poller = new StreamPoller(statePath);
  const channel = getTargetChannel(client, config);

  // just give up if the channel doesn't exist
  if (channel === undefined) {
    console.log('channel undefined: ', config);
    return;
  }

  const send = (channel.send as Sender).bind(channel);

  poller.updateFilter = filterLiveUpdate(
    config.isGameWhitelisted || (() => true),
  );

  const update = (): void => {
    poller.pollLiveStreams(query).then(liveUpdate => {
      sendLiveUpdate(send, liveUpdate, config.getFlavor);
    });
  };

  update();
  setInterval(update, updateInterval);
};
