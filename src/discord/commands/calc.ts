import Discord from 'discord.js';
import { Command } from '../Command';
import { matchCalcCommand, handleCalcCommand } from '../../lib/size-calc';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchCalcCommand(message.content);
  },

  handle(message: Discord.Message) {
    const response = handleCalcCommand(message.content);

    return message.channel.send(response);
  },
};
