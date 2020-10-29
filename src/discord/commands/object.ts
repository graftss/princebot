import Discord from 'discord.js';
import { Command } from '../Command';
import {
  matchObjectCommand,
  handleObjectCommand,
} from '../../lib/reroll-strings';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchObjectCommand(message.content);
  },

  handle(message: Discord.Message) {
    const response = handleObjectCommand(message.content);
    return message.channel.send(response);
  },
};
