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
import { handleSize } from './commands/size';
import { handleAddCommand } from './commands/addcommand';

const commands: T.Command[] = [handleQuote, handleObject, handleSize];

const nonglobalCommands: { [key: string]: T.Command[] } = {
  '#randomizerhater92': [
    handleAdd,
    handlePull,
    handleSocials,
    handleSong,
    handleAddCommand,
  ],

  '#dunewacky': [handleAddCommand],
};

export const createTwitchBot = (): Promise<[string, number]> => {
  const options = {
    identity: auth.twitchChat,
    channels: [
      '#randomizerhater92',
      '#dunewacky',
      '#martini',
      '#enzor_au',
      '#shamana',
      '#forginal',
    ],
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

    const runCommand = (cmd): void => cmd(client, message, tags);

    commands.forEach(runCommand);

    const channelCommands = nonglobalCommands[message.channel];
    if (channelCommands !== undefined) {
      channelCommands.forEach(runCommand);
    }
  });

  mongodbConnect().catch(e => console.log('mongod error', e));

  return client.connect();
};
