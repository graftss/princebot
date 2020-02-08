import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';
import { Command } from './Command';
import { auth } from './auth';

const client = new Discord.Client();

const loadCommands = (dir: string): Command[] => {
  return fs.readdirSync(dir).map(file => require(path.join(dir, file)).command);
};

const commands = loadCommands(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('initializing');

  commands.forEach(command => {
    if (command.onReady) {
      command.onReady(client);
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

client.login(auth.discord.token);
