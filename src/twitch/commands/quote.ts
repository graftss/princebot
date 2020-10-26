import { Command } from '../types';
import {
  matchQuoteCommand,
  handleQuoteCommand,
} from '../../lib/reroll-strings';

export const handleQuote: Command = (client, message) => {
  const { channel, text } = message;

  if (!matchQuoteCommand(text)) return;

  client.say(channel, handleQuoteCommand(text));
};
