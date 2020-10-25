import Discord from 'discord.js';
import { Command } from '../Command';
import {
  KDRStringRow,
  Language,
  stringDb,
  parseLanguage,
  printKdrString,
} from '../../lib/reroll-strings';

const parseLangFromArgs = (args: string[]): Language => {
  if (args.length < 2) return Language.ENGLISH;
  const l = parseLanguage(args[1]);
  return l == undefined ? Language.ENGLISH : l;
};

export const command: Command = {
  match(message: Discord.Message): boolean {
    return (
      message.content.startsWith('.quote') ||
      message.content.startsWith('.string')
    );
  },

  handle(message: Discord.Message) {
    const args = message.content.split(/\s+/);

    const l: Language = parseLangFromArgs(args);
    const row: KDRStringRow = message.content.startsWith('.quote')
      ? stringDb.randomSpokenString(l)
      : stringDb.randomString(l);

    let msg: string;

    if (l === Language.ENGLISH) {
      msg = printKdrString(row, Language.ENGLISH);
    } else {
      msg = printKdrString(row, l);

      if (row.ENGLISH !== '') {
        msg += `\n\n(${printKdrString(row, Language.ENGLISH)})`;
      }
    }

    return message.channel.send(msg);
  },
};
