import { Command } from '../types';

const rewardId = 'ebc76e9e-46aa-4e8b-8db4-65b4645f9ed6';

export const handleAdd: Command = (client, message, tags) => {
  if (tags['custom-reward-id'] !== rewardId) return;

  const { channel } = message;

  client.say(channel, 'Hmmmmm.');
};
