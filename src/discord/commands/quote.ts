import Discord from 'discord.js';
import { Command } from '../Command';
import {
  KDRStringRow,
  Language,
  stringDb,
  parseLanguage,
  langStr,
} from '../../lib/reroll-strings';

const parseLangFromArgs = (args: string[]): Language => {
  if (args.length < 2) return Language.ENGLISH;
  const l = parseLanguage(args[1]);
  return l == undefined ? Language.ENGLISH : l;
};

export const command: Command = {
  cooldown: 300,

  match(message: Discord.Message): boolean {
    return message.content.startsWith('.quote');
  },

  handle(message: Discord.Message) {
    const args = message.content.split(/\s+/);

    const l: Language = parseLangFromArgs(args);
    const lang: string = langStr(l);
    const row: KDRStringRow = stringDb.randomString(l);

    const msg =
      l == Language.ENGLISH ? row.ENGLISH : `${row[lang]} \n\n(${row.ENGLISH})`;

    return message.channel.send(msg);
  },
};
