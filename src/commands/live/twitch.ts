import request from 'request-promise';
import * as _ from 'lodash';
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

export interface UserInfo {
  username: string;
  avatarUrl: string;
}

export interface LiveStreamInfo extends StreamInfo, UserInfo {}

export type LiveUpdate = LiveStreamInfo[];

const headers = {
  Authorization: `Bearer: ${auth.twitch.secret}`,
  'Client-ID': auth.twitch.clientId,
};

const extractUserInfo = (twitchUserObj: any): UserInfo => ({
  username: twitchUserObj.display_name,
  avatarUrl: twitchUserObj.profile_image_url,
});

export const getUserInfo = (usernames: string[]): Promise<UserInfo[]> => {
  return request({
    uri: 'https://api.twitch.tv/helix/users',
    qs: {
      login: usernames,
    },
    json: true,
    headers,
  }).then(res => res.data.map(extractUserInfo));
};

const extractStreamInfo = (twitchStreamObj: any): StreamInfo => ({
  userId: twitchStreamObj.user_id,
  username: twitchStreamObj.user_name,
  gameId: twitchStreamObj.game_id,
  title: twitchStreamObj.title,
});

export const getTwitchStreamInfo = (
  query: StreamQuery,
): Promise<StreamInfo[]> => {
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

export const getTwitchUpdate = (query: StreamQuery): Promise<LiveUpdate> => {
  return getTwitchStreamInfo(query).then(streams => {
    // don't query `users` if there aren't any streams
    if (streams.length === 0) return [];

    return getUserInfo(streams.map(s => s.username)).then(users =>
      _.zipWith(streams, users, (a, b) => ({ ...a, ...b })),
    );
  });
};
