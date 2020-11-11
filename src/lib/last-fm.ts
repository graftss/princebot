import request from 'request-promise';
import cheerio from 'cheerio';

export interface Track {
  artist: string;
  name: string;
}

export const trackToString = (track: Track): string =>
  `${track.artist} - ${track.name}`;

const lastFmUserUrl = (username: string): string =>
  `https://last.fm/user/${username}`;

export const nowPlaying = (username: string): Promise<Track | undefined> =>
  request(lastFmUserUrl(username))
    .then(cheerio.load)
    .then(($: any) => {
      const name: string | undefined = $('.chartlist-name > a').attr('title');
      const artist: string | undefined = $('.chartlist-artist > a').attr(
        'title',
      );

      return name && artist && { name, artist };
    });
