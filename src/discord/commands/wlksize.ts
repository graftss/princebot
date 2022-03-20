import Discord from 'discord.js';
import { Command } from '../Command';
import {
  matchWlkSizeCommand,
  handleWlkSizeCommand,
  WlkObject,
} from '../../lib/wlk-sizes';
import { CHANNEL_IDS } from '../constants';

const formatMatches = (matches: WlkObject[]): string =>
  matches.map(obj => `**${obj.name}**: ${obj.displaySize}`).join(' | ');

export const command: Command = {
  match(message: Discord.Message): boolean {
    return (
      (message.channel.id === CHANNEL_IDS.KD_BOTSPAM ||
        message.channel.id === CHANNEL_IDS.TEST_GENERAL) &&
      matchWlkSizeCommand(message.content)
    );
  },

  handle(message: Discord.Message) {
    const matches = handleWlkSizeCommand(message.content);

    if (matches.length > 0) {
      return message.channel.send(formatMatches(matches));
    }
  },
};
