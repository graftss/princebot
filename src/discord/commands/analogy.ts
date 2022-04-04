import Discord from 'discord.js';
import { Command } from '../Command';
import { matchAnalogyCommand, handleAnalogyCommand } from '../../lib/size-calc';
import { CHANNEL_IDS } from '../constants';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return (
      (message.channel.id === CHANNEL_IDS.KD_BOTSPAM ||
        message.channel.id === CHANNEL_IDS.TEST_GENERAL) &&
      matchAnalogyCommand(message.content)
    );
  },

  handle(message: Discord.Message) {
    const response = handleAnalogyCommand(message.content);

    return message.channel.send(response);
  },
};
