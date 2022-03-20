import { Command } from '../types';
import {
  matchWlkSizeCommand,
  handleWlkSizeCommand,
  WlkObject,
} from '../../lib/wlk-sizes';

const renderObjectText = (obj: WlkObject): string =>
  `${obj.name}: ${obj.displaySize}`;

export const handleWlkSize: Command = (client, message) => {
  const { channel, text } = message;

  if (!matchWlkSizeCommand(text)) return;

  const objects = handleWlkSizeCommand(text);
  let response = '';

  for (let i = 0; i < objects.length; i++) {
    response += renderObjectText(objects[i]);
    if (response.length > 360) {
      response += ` (${objects.length - i - 1} objects hidden)`;
      break;
    }
    if (i < objects.length - 1) response += ' | ';
  }

  if (response !== '') client.say(channel, response);
};
