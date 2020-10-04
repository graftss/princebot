import { Command } from '../../Command';
import { onReady, NotificationConfig } from './onReady';

const testConfig: NotificationConfig = {
  guildId: '572531842952200223',
  channelId: '675463218050891806',
  updateInterval: 5 * 1000,
  query: {
    usernames: [
      'dunewacky',
      'iateyourpie',
      'harutomo',
      'trihex',
      'ickyy',
      'vektroidlive',
      'tempest_fox',
    ],
  },
  persist: false,
};

const chestConfig: NotificationConfig = {
  guildId: '679160088090640424',
  channelId: '679344618411655168',
  updateInterval: 60 * 1000,
  isGameWhitelisted: (game: string): boolean =>
    game.includes('stretch panic') ||
    game.includes('silhouette mirage') ||
    game.includes('rakugaki'),
  query: {
    usernames: ['chaos42666', 'dunewacky', 'pimittens', 'placebo120', 'rrifff'],
  },
};

const prodConfig: NotificationConfig = {
  guildId: '232268612285497345',
  channelId: '535643965899276289',
  updateInterval: 60 * 1000,
  isGameWhitelisted: (game: string): boolean =>
    game.includes('katamari') ||
    game.includes('turbo turtle adventure') ||
    game.includes('wattam'),
  query: {
    usernames: [
      'cherry_soup',
      'csaur',
      'devteamster',
      'dunewacky',
      'enzor_au',
      'euclid999',
      'gordonpint',
      'harutomo',
      'hotdogturtle',
      'italyflecktarn',
      'jokopoking',
      'journeymanb',
      'klohinx',
      'kofize',
      'kotonebeta',
      'kumasbear',
      'malkieriking',
      'martini',
      'midboss2',
      'paperspine',
      'pimittens',
      'pvtcb',
      'randomizerhater92',
      'rattmann_',
      'shamana',
      'sisuka7',
      'theterrifictracy',
    ],
  },
};

export const command: Command = {
  onReady: client => {
    if (process.env.NODE_ENV === 'development') {
      onReady(client, testConfig);
    } else {
      onReady(client, prodConfig);
      onReady(client, chestConfig);
    }
  },
};
