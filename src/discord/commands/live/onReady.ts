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
    const { liveState } = this;
    const streams = this.updateFilter ? this.updateFilter(update) : update;

    // remove streams that have gone offline from the state
    for (const userId in liveState) {
      if (streams.filter(s => s.userId === userId).length === 0) {
        delete liveState[userId];
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
): Discord.RichEmbed => {
  const result = new Discord.RichEmbed()
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

type Sender = (msg: string, embed: Discord.RichEmbed) => any;

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
): Discord.TextChannel =>
  client.guilds
    .find(g => g.id === config.guildId)
    .channels.find(c => c.id === config.channelId) as Discord.TextChannel;

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
