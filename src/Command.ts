import Discord from 'discord.js';

export interface Command {
  match(message: Discord.Message): boolean;
  handle(message: Discord.Message): Promise<Discord.Message | Discord.Message[]>;
}
