import Discord from 'discord.js';
import {
  LiveUpdate,
  StreamQuery,
  StreamInfo,
  getTwitchStreams,
} from './twitch';

class StreamPoller {
  liveState = {};

  // diffs `liveState` with `update`, and returns a `LiveUpdate` that contains
  // only new streams.
  private updateLiveState(update: LiveUpdate): LiveUpdate {
    const { liveState } = this;
    const streams = update;

    // remove streams that have gone offline from the state
    for (const userId in liveState) {
      if (streams.filter(s => s.userId === userId).length === 0) {
        liveState[userId] = undefined;
      }
    }

    // add streams that have gone online to the state and the result
    const result = streams.filter(stream => !liveState[stream.userId]);
    streams.forEach(stream => (liveState[stream.userId] = stream));

    return result;
  }

  pollLiveStreams(query: StreamQuery): Promise<LiveUpdate> {
    return getTwitchStreams(query).then(update => this.updateLiveState(update));
  }
}

// const katamariGameIds = [
//   '10902', // Katamari Damacy
//   '10724', // Beautiful Katamari
//   '16842', // We Love Katamari
//   '23196', // Katamari Forever,
// ];

const filterLiveUpdate = (update: LiveUpdate): LiveUpdate =>
  // update.filter(stream => katamariGameIds.includes(stream.gameId));
  update;

const sample = (arr): any => arr[Math.floor(Math.random() * arr.length)];
const emotes = [
  '<:babyCow:625343020702629889>',
  '<:dogLuck:606340486206193714>',
  '<:pogHam:611584211660439552>',
  '<:scuffed:609557151685279805>',
  '<:cartLady:606338985706651688>',
];
const slots = (): any =>
  [sample(emotes), sample(emotes), sample(emotes)].join(' ');

const embedStreamInfo = (stream: StreamInfo): Discord.RichEmbed =>
  new Discord.RichEmbed()
    .setURL(`https://www.twitch.tv/${stream.username}`)
    .setAuthor(stream.username)
    .setTitle(stream.title)
    .setDescription(slots())
    .setColor('#7289da')
    .setTimestamp();

const messagifyLiveUpdate = (update: LiveUpdate): Discord.RichEmbed[] =>
  update.map(embedStreamInfo);

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
}

export const onReady = (
  client: Discord.Client,
  config: NotificationConfig,
): void => {
  const { updateInterval, query } = config;

  const poller = new StreamPoller();
  const channel = getTargetChannel(client, config);

  const update = (): void => {
    poller.pollLiveStreams(query).then(liveUpdate => {
      messagifyLiveUpdate(filterLiveUpdate(liveUpdate)).forEach(
        channel.send.bind(channel),
      );
    });
  };

  update();
  setInterval(update, updateInterval);
};
