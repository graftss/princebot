import { join } from 'path';
import { Command } from '../types';
import { PersistentState } from '../../lib/PersistentState';

type ChannelCommands = { [cmd in string]: string };
type SavedCommands = { [channel in string]: ChannelCommands };

const statePath = join(__dirname, 'custom-commands.json');
const persistentCommandState = new PersistentState<SavedCommands>(statePath, {
  defaultState: {},
  writePretty: true,
});

export const handleAddCommand: Command = (client, message) => {
  const { channel, text, sender } = message;
  const inOwnChannel = '#' + sender === channel;
  const state = persistentCommandState.get();

  if (inOwnChannel) {
    if (text.startsWith('!newcommand ')) {
      const match = text.match(/^!newcommand\s+(![^\s]+)\s+([^\s].+)$/);
      if (!match) return client.say(channel, `i dont understand sorry`);
      const [_, key, value] = match;

      if (state[channel] === undefined) state[channel] = {};
      state[channel][key] = value;
      persistentCommandState.set(state);

      return client.say(channel, `ok i added ${key} gl`);
    } else if (text.startsWith('!deletecommand ')) {
      const key = text.replace(/^!deletecommand\s+/, '');

      if (state[channel] === undefined || state[channel][key] === undefined) {
        return client.say(channel, 'you dont have that soary');
      }

      delete state[channel][key];
      persistentCommandState.set(state);
      return client.say(channel, `ok ${key} deleted`);
    }
  }

  const channelCommands = state[channel] || {};
  for (const key in channelCommands) {
    if (text == key) {
      return client.say(channel, channelCommands[key]);
    }
  }
};
