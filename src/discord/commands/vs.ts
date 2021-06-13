import Discord from 'discord.js';
import { Command } from '../Command';
import { matchVsCommand, handleVsCommand } from '../../lib/size-calc';
import { CHANNEL_IDS } from '../constants';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchVsCommand(message.content) && (
      message.channel.id === CHANNEL_IDS.KD_BOTSPAM ||
      process.env.NODE_ENV === 'development'
    );
  },

  handle(message: Discord.Message) {
    const response = handleVsCommand(message.content);

    return message.channel.send(response);
  },
};
