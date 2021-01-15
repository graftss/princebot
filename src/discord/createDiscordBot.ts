import path from 'path';
import Discord from 'discord.js';
import { auth } from '../auth';
import { PersistentState } from '../lib/PersistentState';
import { loadCommandsFromDir, Command } from './Command';

interface ClientConfig {
  statePath: string;
  commandsDir: string;
}

const config: ClientConfig = {
  statePath: path.resolve('../state.json'),
  commandsDir: path.join(__dirname, 'commands'),
};

class CooldownManager {
  private cooldowns: Set<Command> = new Set();

  onCooldown(command: Command): boolean {
    return this.cooldowns.has(command);
  }

  // if the command is on cooldown, returns false
  // otherwise, returns true and puts the command on cooldown
  runCommand(command: Command): boolean {
    if (this.cooldowns.has(command)) return false;

    if (command.cooldown !== undefined) {
      this.cooldowns.add(command);
      setTimeout(() => this.cooldowns.delete(command), command.cooldown * 1000);
    }

    return true;
  }
}

export const createDiscordBot = (): Promise<string> => {
  const client = new Discord.Client();
  const commands = loadCommandsFromDir(config.commandsDir);
  const state: PersistentState<any> = new PersistentState(config.statePath);
  const cooldownManager: CooldownManager = new CooldownManager();

  client.once('ready', () => {
    commands.forEach(command => {
      if (command && command.onReady) {
        command.onReady(client, state);
      }
    });
  });

  client.on('message', message => {
    commands.forEach(command => {
      if (
        command &&
        command.match &&
        command.handle &&
        command.match(message) &&
        !cooldownManager.onCooldown(command)
      ) {
        cooldownManager.runCommand(command);
        command.handle(message);
      }
    });
  });

  return client.login(auth.discord.token);
};
