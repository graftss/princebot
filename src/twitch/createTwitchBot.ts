import tmi from 'tmi.js';
import { auth } from '../auth';
import * as T from './types';
import { mongodbConnect } from './mongodb';
import { handleSocials } from './commands/socials';
import { handleAdd } from './commands/pp-add';
import { handlePull } from './commands/pp-pull';
import { handleQuote } from './commands/quote';
import { handleObject } from './commands/object';
import { handleSong } from './commands/song';

const commands: T.Command[] = [
  handleAdd,
  handlePull,
  handleSocials,
  handleQuote,
  handleObject,
  handleSong,
];

export const createTwitchBot = (): Promise<[string, number]> => {
  const options = {
    identity: auth.twitchChat,
    channels: ['#randomizerhater92', '#dunewacky', '#martini'],
  };

  const client = tmi.Client(options);

  client.on('raw_message', ({ command, tags, params }) => {
    if (command !== 'PRIVMSG') return;
    if (tags['display-name'] === options.identity.username) return;

    const message: T.Message = {
      channel: params[0],
      text: params[1],
      sender: tags['display-name'],
    };

    commands.forEach(cmd => cmd(client, message, tags));
  });

  mongodbConnect().catch(e => console.log('mongod error', e));

  return client.connect();
};
