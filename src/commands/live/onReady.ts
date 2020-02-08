import Discord from 'discord.js';
import request from 'request-promise';
import { auth } from '../../auth';

interface StreamQuery {
  usernames: string[];
}

interface StreamInfo {
  userId: string;
  userName: string;
  gameId: string;
  title: string;
}

type LiveUpdate = StreamInfo[];

const extractStreamInfo = (twitchStreamObj: any): StreamInfo => ({
  userId: twitchStreamObj.user_id,
  userName: twitchStreamObj.user_name,
  gameId: twitchStreamObj.game_id,
  title: twitchStreamObj.title,
});

const headers = {
  Authorization: `Bearer: ${auth.twitch.secret}`,
  'Client-ID': auth.twitch.clientId,
};

const getLiveStreams = (query: StreamQuery): Promise<LiveUpdate> => {
  return request({
    uri: 'https://api.twitch.tv/helix/streams',
    qs: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_login: query.usernames,
    },
    json: true,
    headers,
  }).then(res => res.data.map(extractStreamInfo));
};

class TwitchNotifier {
  private liveState = {};

  // diffs `liveState` with `update`, and returns a `LiveUpdate` that contains
  // only new streams.
  updateLiveState(update: LiveUpdate): LiveUpdate {
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
    return getLiveStreams(query).then(update => this.updateLiveState(update));
  }
}

const katamariGameIds = [
  '10902', // Katamari Damacy
  '10724', // Beautiful Katamari
  '16842', // We Love Katamari
  '23196', // Katamari Forever,
];

const filterLiveUpdate = (update: LiveUpdate): LiveUpdate =>
  update.filter(stream => katamariGameIds.includes(stream.gameId));

const embedStreamInfo = (stream: StreamInfo): Discord.RichEmbed =>
  new Discord.RichEmbed()
    .setURL(`https://www.twitch.tv/${stream.userName}`)
    .setAuthor(stream.userName)
    .setTitle(stream.title)
    .setDescription(':dogLuck:')
    .setColor('#7289da')
    .setTimestamp();

const messagifyLiveUpdate = (update: LiveUpdate): Discord.RichEmbed[] =>
  update.map(embedStreamInfo);

const getTargetChannels = (client: Discord.Client): Discord.TextChannel[] => {
  if (false) {
    // testing
    const channel = client.guilds
      .find(guild => guild.name === 'test palace')
      .channels.find(ch => ch.name === 'streams') as Discord.TextChannel;
    return [channel];
  } else {
    return client.guilds
      .map(guild => {
        return guild.channels.find(
          ch => ch.name === 'stream-announcements',
        ) as Discord.TextChannel;
      })
      .filter(ch => ch);
  }
};

export const onReady = (client: Discord.Client): void => {
  const UPDATE_INTERVAL = 60 * 1000;
  const usernames = [
    'dunewacky',
    'harutomo',
    'jokopoking',
    'klohinx',
    'kumasbear',
    'martini',
    'midboss2',
    'pimittens',
    'pvtcb',
    'randomizerhater92',
    'rattmann_',
  ];

  const notifier = new TwitchNotifier();
  const channels = getTargetChannels(client);

  const update = (): void => {
    notifier.pollLiveStreams({ usernames }).then(liveUpdate => {
      const embeds = messagifyLiveUpdate(filterLiveUpdate(liveUpdate));
      embeds.forEach(embed => channels.forEach(ch => ch.send(embed)));
    });
  };

  update();
  setInterval(update, UPDATE_INTERVAL);
};
