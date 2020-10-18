import { Command } from '../types';
import { Thing } from '../pickpocket';

const rewardId = 'ebc76e9e-46aa-4e8b-8db4-65b4645f9ed6';

const reactions: string[] = [
  'Hmmmm.',
  'Hmmmmmmmm?',
  'Hmm....mm?',
  'OK.',
  'OK?',
  'WHAT!',
  'What? OK.',
  'Fine.',
  '....',
  '...................................................................?',
];

const sample = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

export const handleAdd: Command = (client, message, tags) => {
  if (tags['custom-reward-id'] !== rewardId) return;

  const { channel, text, sender } = message;

  Thing.create({ content: text, adder: sender })
    .then(() => client.say(channel, sample(reactions)))
    .catch(e => console.log('error adding:', e));
};
