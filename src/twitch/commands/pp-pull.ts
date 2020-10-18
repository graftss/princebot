import { Command } from '../types';
import { Thing } from '../pickpocket';

const rewardId = '4de0d67d-83f6-42cc-b4ea-5fa30ac7930d';

export const handlePull: Command = (client, message, tags) => {
  if (tags['custom-reward-id'] !== rewardId) return;

  Thing.aggregate()
    .sample(1)
    .then(thing => {
      client.say(message.channel, thing[0].content);
    });
};
