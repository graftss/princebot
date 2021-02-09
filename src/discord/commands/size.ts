import Discord from 'discord.js';
import { Command } from '../Command';
import {
  KDRObject,
  matchSizeCommand,
  handleSizeCommand,
  pickupSizeToString,
} from '../../lib/reroll-objects';
import { Language, stringDb } from '../../lib/reroll-strings';

const renderObject = (object: KDRObject, l: Language): string => {
  const name = stringDb.getString(object.nameStrId as string, l) as string;
  const size = pickupSizeToString(object.pickupSize as number);
  return `${name}: ${size}`;
};

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchSizeCommand(message.content);
  },

  handle(message: Discord.Message) {
    const { primaryLanguage, objects } = handleSizeCommand(message.content);
    let response = '';

    for (let i = 0; i < objects.length; i++) {
      response += renderObject(objects[i], primaryLanguage);
      if (response.length > 360) {
        response += ` (${objects.length - i - 1} objects hidden)`;
        break;
      }
      if (i < objects.length - 1) response += ' | ';
    }

    if (response !== '') return message.channel.send(response);
  },
};
