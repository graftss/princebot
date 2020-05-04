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
  game: string | null;
  title: string;
}

export interface UserInfo {
  username: string;
  avatarUrl: string;
}

export interface LiveStreamInfo extends StreamInfo, UserInfo {}

export type LiveUpdate = LiveStreamInfo[];

class TwitchOAuthToken {
  private token: string = '';

  constructor(private clientID: string, private clientSecret: string) {}

  getToken(): string {
    return this.token;
  }

  refreshToken(): Promise<string> {
    return request({
      method: 'POST',
      uri: 'https://id.twitch.tv/oauth2/token',
      qs: {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
      json: true,
    }).then(res => this.token = res.access_token);
  }
}

const oauth = new TwitchOAuthToken(auth.twitch.clientId, auth.twitch.secret);

const getHeaders = () => ({
  Authorization: `Bearer ${oauth.getToken()}`,
  'Client-ID': auth.twitch.clientId,
  'Accept': 'application/vnd.twitchtv.v5+json',
});

const twitchRequest = (args: any) =>
  request(({
    ...args,
    json: true,
    headers: getHeaders(),
  }))
    .catch(e => {
      // oauth token failure
      if (e.response.body.status === 401) {
        return oauth.refreshToken()
          .then(() => twitchRequest(args));
      }
    })

const extractUserInfo = (twitchUserObj: any): UserInfo => ({
  username: twitchUserObj.display_name,
  avatarUrl: twitchUserObj.profile_image_url,
});

export const getUserInfo = (usernames: string[]): Promise<UserInfo[]> => {
  return twitchRequest({
    uri: 'https://api.twitch.tv/helix/users',
    qs: {
      login: usernames,
    },
  }).then(res => res.data.map(extractUserInfo));
};

interface TwitchGameObject {
  id: string;
  name: string;
  box_art_url: string;
}

class GameNameResolver {
  cache: { [K in string]: string } = {};

  resolve(ids: string[]): Promise<string[]> {
    if (_.every(ids, id => this.cache[id] !== undefined)) {
      return Promise.resolve(ids.map(id => this.cache[id]));
    }

    return twitchRequest({
      uri: 'https://api.twitch.tv/helix/games',
      qs: { id: ids },
    }).then((res: { data: TwitchGameObject[] }) => {
      res.data.forEach(obj => (this.cache[obj.id] = obj.name));
      return ids.map(id => this.cache[id]);
    });
  }
}

const gameNameResolver = new GameNameResolver();

const extractStreamInfo = (twitchStreamObj: any): StreamInfo => ({
  userId: twitchStreamObj.user_id,
  username: twitchStreamObj.user_name,
  gameId: twitchStreamObj.game_id,
  game: null,
  title: twitchStreamObj.title,
});

export const getTwitchStreamInfo = (
  query: StreamQuery,
): Promise<StreamInfo[]> => {
  return twitchRequest({
    uri: 'https://api.twitch.tv/helix/streams',
    qs: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_login: query.usernames,
    },
  })
    .then(res => res.data.map(extractStreamInfo))
    .then((streams: StreamInfo[]) =>
      gameNameResolver
        .resolve(streams.map(stream => stream.gameId))
        .then(games => {
          _.zipWith(streams, games, (stream, game) => (stream.game = game));
          return streams;
        }),
    );
};

export const getTwitchUpdate = (query: StreamQuery): Promise<LiveUpdate> => {
  return getTwitchStreamInfo(query)
    .then(streams => {
      // don't query `users` if there aren't any streams
      if (streams.length === 0) return [];

      return getUserInfo(streams.map(s => s.username)).then(users =>
        _.zipWith(streams, users, _.merge),
      );
    })
    .catch(() => []);
};
