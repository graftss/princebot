import Discord from 'discord.js';
import { Command } from '../Command';

export const command: Command = {
  match(message: Discord.Message): boolean {
    return message.content === '!intro';
  },

  handle(message: Discord.Message) {
    return message.channel.send('hi');
  }
}
