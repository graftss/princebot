import Discord from 'discord.js';
import { Command } from '../Command';

// copy-pasted from old bot
const parseTime = (time: string): number => {
  const match = time.match(/(?:(\d*)h)?(?:(\d*)m)?(?:(\d*)s)?/);
  if (match === null) return 0;

  const hours = !isNaN(Number(match[1])) && Number(match[1]),
    minutes = !isNaN(Number(match[2])) && Number(match[2]),
    seconds = !isNaN(Number(match[3])) && Number(match[3]);

  return (
    (hours ? hours * 60 * 60 * 1000 : 0) +
    (minutes ? minutes * 60 * 1000 : 0) +
    (seconds ? seconds * 1000 : 0)
  );
}

export const command: Command = {
  match(message: Discord.Message): boolean {
    return message.content.startsWith('!reminder');
  },

  handle(message: Discord.Message) {
    const time = message.content.split(' ')[1];
    const timeMs = parseTime(time);

    if (!time || !timeMs) {
      return message.channel.send('try "!reminder \\__h\\__m\\__s"');
    }

    setTimeout(() => {
      message.channel.send(`${message.author.toString()} beep`);
    }, timeMs);

    return message.channel.send(`reminder set for ${time}`);
  },
};
