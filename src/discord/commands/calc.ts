import Discord from 'discord.js';
import { Command } from '../Command';
import { matchCalcCommand, handleCalcCommand } from '../../lib/size-calc';
import { CHANNEL_IDS } from '../constants';

console.log('hi');

export const command: Command = {
  match(message: Discord.Message): boolean {
    return (
      message.channel.id === CHANNEL_IDS.KD_BOTSPAM &&
      matchCalcCommand(message.content)
    );
  },

  handle(message: Discord.Message) {
    const response = handleCalcCommand(message.content);

    return message.channel.send(response);
  },
};
