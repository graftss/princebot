import { Command } from '../types';
import { nowPlaying, trackToString } from '../../lib/last-fm';

export const handleSong: Command = (client, message) => {
  const { channel, text } = message;

  if (text !== '!song') return;

  nowPlaying('catake').then(track => {
    if (track === undefined) return;

    client.say(channel, trackToString(track));
  });
};
