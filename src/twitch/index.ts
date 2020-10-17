import tmi from 'tmi.js';
import { auth } from '../auth';
import * as T from './types';
import { handleSocials } from './commands/socials';
import { handleAdd } from './commands/add';

const commands: T.Command[] = [handleAdd, handleSocials];

const options = {
  identity: auth.twitchChat,
  channels: ['#randomizerhater92'],
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

client.connect();
