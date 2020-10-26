import Discord from 'discord.js';
import { Command } from '../Command';
import {
  matchQuoteCommand,
  handleQuoteCommand,
} from '../../lib/reroll-strings';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchQuoteCommand(message.content);
  },

  handle(message: Discord.Message) {
    const response = handleQuoteCommand(message.content);

    return message.channel.send(response);
  },
};
