import { Command } from '../types';
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

export const handleSize: Command = (client, message) => {
  const { channel, text } = message;

  if (!matchSizeCommand(text)) return;

  const { primaryLanguage, objects } = handleSizeCommand(text);
  let response = '';

  for (var i = 0; i < objects.length; i++) {
    response += renderObject(objects[i], primaryLanguage);
    if (response.length > 360) {
      response += ` (${(objects.length - i - 1)} objects hidden)`;
      break;
    }
    if (i < objects.length - 1) response += ' | ';
  }

  if (response !== '') client.say(channel, response);
};
