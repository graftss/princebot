import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';
import { Command } from './Command';
import { getToken } from './token';

const client = new Discord.Client();

const loadCommands = (dir: string): Command[] =>
  fs.readdirSync(dir)
    .map(file => require(path.join(dir, file)).command);

const commands = loadCommands(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('listening');
});

console.log(commands[0])

client.on('message', message => {
  commands.forEach(command => {
    if (command.match(message)) {
      command.handle(message);
    }
  })
});

client.login(getToken());
