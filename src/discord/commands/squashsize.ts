import Discord from 'discord.js';
import { Command } from '../Command';
import {
  handleSizeCommand,
  renderObjectText,
  matchSquashSizeCommand,
} from '../../lib/reroll-objects';
import { CHANNEL_IDS } from '../constants';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return (
      (message.channel.id === CHANNEL_IDS.KD_BOTSPAM ||
        message.channel.id === CHANNEL_IDS.TEST_GENERAL) &&
      matchSquashSizeCommand(message.content)
    );
  },

  handle(message: Discord.Message) {
    const { primaryLanguage, objects } = handleSizeCommand(message.content);
    let response = '';

    for (let i = 0; i < objects.length; i++) {
      response += renderObjectText(objects[i], primaryLanguage, {
        includeSquashDiam: true,
      });
      if (response.length > 360) {
        response += ` (${objects.length - i - 1} objects hidden)`;
        break;
      }
      if (i < objects.length - 1) response += ' | ';
    }

    if (response !== '') return message.channel.send(response);
  },
};
