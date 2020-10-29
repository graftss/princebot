import { Command } from '../types';
import {
  matchObjectCommand,
  handleObjectCommand,
} from '../../lib/reroll-strings';

export const handleObject: Command = (client, message) => {
  const { channel, text } = message;

  if (!matchObjectCommand(text)) return;

  client.say(channel, handleObjectCommand(text));
};
