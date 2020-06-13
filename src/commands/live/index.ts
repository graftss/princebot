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
      'mechasheeva',
    ],
  },
  persist: false,
};

const prodConfig: NotificationConfig = {
  guildId: '232268612285497345',
  channelId: '535643965899276289',
  updateInterval: 60 * 1000,
  query: {
    usernames: [
      'cherry_soup',
      'csaur',
      'devteamster',
      'dunewacky',
      'enzor9000',
      'euclid999',
      'harutomo',
      'hotdogturtle',
      'italyflecktarn',
      'jokopoking',
      'journeymanb',
      'klohinx',
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
      'sisuka7',
      'theterrifictracy',
    ],
  },
};

export const command: Command = {
  onReady: client => {
    const config =
      process.env.NODE_ENV === 'development' ? testConfig : prodConfig;
    return onReady(client, config);
  },
};
