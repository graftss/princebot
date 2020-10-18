import path from 'path';
import Discord from 'discord.js';
import { auth } from '../auth';
import { loadCommandsFromDir } from './Command';
import { PersistentState } from './PersistentState';

interface ClientConfig {
  statePath: string;
  commandsDir: string;
}

const config: ClientConfig = {
  statePath: path.resolve('../state.json'),
  commandsDir: path.join(__dirname, 'commands'),
};

export const createDiscordBot = (): Promise<string> => {
  const client = new Discord.Client();
  const commands = loadCommandsFromDir(config.commandsDir);
  const state: PersistentState<any> = new PersistentState(config.statePath);

  client.once('ready', () => {
    commands.forEach(command => {
      if (command.onReady) {
        command.onReady(client, state);
      }
    });
  });

  client.on('message', message => {
    commands.forEach(command => {
      if (command.match && command.handle && command.match(message)) {
        command.handle(message);
      }
    });
  });

  return client.login(auth.discord.token);
};

createDiscordBot();
