import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';

export interface Command {
  match?: (message: Discord.Message) => boolean;
  handle?: (
    message: Discord.Message,
  ) => Maybe<Promise<Discord.Message | Discord.Message[]>>;
  onReady?: (client: Discord.Client, state: any) => void;

  // cooldown on the command triggering (in seconds)
  cooldown?: number;
}

export const loadCommandsFromDir = (dir: string): Command[] =>
  fs.readdirSync(dir).map(file => require(path.join(dir, file)).command);
