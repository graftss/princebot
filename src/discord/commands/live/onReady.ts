import path from 'path';
import Discord from 'discord.js';
import { PersistentState } from '../../PersistentState';
import {
  LiveUpdate,
  StreamQuery,
  LiveStreamInfo,
  getTwitchUpdate,
} from './twitch';

type LiveState = { [K in string]: LiveStreamInfo };

class StreamPoller {
  liveState: LiveState = {};

  persist: boolean;
  persistentState: PersistentState<LiveState>;

  constructor(persistentStatePath?: string) {
    if (persistentStatePath !== undefined) {
      this.persist = true;
      this.persistentState = new PersistentState(persistentStatePath, {
        defaultState: this.liveState,
        writePretty: true,
      });
      this.liveState = this.persistentState.get();
    }
  }

  // diffs `liveState` with `update`, and returns a `LiveUpdate` that contains
  // only new streams.
  private updateLiveState(update: LiveUpdate): LiveUpdate {
    const { liveState } = this;
    const streams = update;

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
    return getTwitchUpdate(query).then(update => this.updateLiveState(update));
  }
}

const isGameWhitelisted = (game: string): boolean =>
  game.includes('katamari') || game.includes('stretch');

const filterLiveUpdate = (update: LiveUpdate): LiveUpdate =>
  update.filter(
    stream => stream.game && isGameWhitelisted(stream.game.toLowerCase()),
  );

const sample = (arr): any => arr[Math.floor(Math.random() * arr.length)];
const emotes = [
  '<:babyCow:625343020702629889>',
  '<:dogLuck:606340486206193714>',
  '<:pogHam:611584211660439552>',
  '<:scuffed:609557151685279805>',
  '<:cartLady:606338985706651688>',
];
const slots = (): any => [1, 2, 3, 4, 5].map(() => sample(emotes)).join(' ');

const twitchUrl = (stream: LiveStreamInfo): string =>
  `https://www.twitch.tv/${stream.username}`;

const embedStreamInfo = (stream: LiveStreamInfo): Discord.RichEmbed =>
  new Discord.RichEmbed()
    .setURL(twitchUrl(stream))
    .setAuthor(`${stream.username} is live!`)
    .setTitle(stream.title)
    .setDescription(`playing ${stream.game}`)
    .addField('\u200b', slots())
    .setColor('#7289da')
    .setThumbnail(stream.avatarUrl)
    .setTimestamp();

type Sender = (msg: string, embed: Discord.RichEmbed) => any;

const sendLiveUpdate = (send: Sender, update: LiveUpdate): void => {
  update.forEach((stream: LiveStreamInfo) => {
    send(`now live: ${twitchUrl(stream)}`, embedStreamInfo(stream));
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
  persist?: boolean;
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

  const update = (): void => {
    poller.pollLiveStreams(query).then(liveUpdate => {
      sendLiveUpdate(send, filterLiveUpdate(liveUpdate));
    });
  };

  update();
  setInterval(update, updateInterval);
};
