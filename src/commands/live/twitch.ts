import request from 'request-promise';
import { auth } from '../../auth';

export interface StreamQuery {
  usernames: string[];
}

export interface StreamInfo {
  userId: string;
  username: string;
  gameId: string;
  title: string;
}

export type LiveUpdate = StreamInfo[];

const extractStreamInfo = (twitchStreamObj: any): StreamInfo => ({
  userId: twitchStreamObj.user_id,
  username: twitchStreamObj.user_name,
  gameId: twitchStreamObj.game_id,
  title: twitchStreamObj.title,
});

const headers = {
  Authorization: `Bearer: ${auth.twitch.secret}`,
  'Client-ID': auth.twitch.clientId,
};

export const getTwitchStreams = (query: StreamQuery): Promise<LiveUpdate> => {
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
