import { Command } from '../types';
import {
  matchSizeCommand,
  handleSizeCommand,
  renderObjectText,
} from '../../lib/reroll-objects';

export const handleSquashSize: Command = (client, message) => {
  const { channel, text } = message;

  if (!matchSizeCommand(text)) return;

  const { primaryLanguage, objects } = handleSizeCommand(text);
  let response = '';

  for (let i = 0; i < objects.length; i++) {
    response += renderObjectText(objects[i], primaryLanguage, {
      includeSquashDiam: true,
    });
    if (response.length > 360) {
      response += ` (${objects.length - i - 1} objects hidden)`;
      break;
    }
    if (i < objects.length - 1) response += ' | ';
  }

  if (response !== '') client.say(channel, response);
};
