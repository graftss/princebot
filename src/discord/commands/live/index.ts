import { Command } from '../../Command';
import { onReady, NotificationConfig } from './onReady';
import { chestEmotes, katamariEmotes, slots } from './slots';

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
      'kittyloafers',
      'elorasaurus_gaming',
      'amberlance0911',
      'ceiling_dad',
    ],
  },
  isGameWhitelisted: (game: string): boolean => game.includes('katamari'),
  persist: false,

  getFlavor: () => slots(chestEmotes, 20),
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
    usernames: [
      'bodogecatuncle',
      'chaos42666',
      'dunewacky',
      'pimittens',
      'placebo120',
      'rrifff',
    ],
  },

  getFlavor: () => slots(chestEmotes, 5),
};

const katamariConfig: NotificationConfig = {
  guildId: '232268612285497345',
  channelId: '535643965899276289',
  updateInterval: 60 * 1000,
  isGameWhitelisted: (game: string): boolean =>
    game.includes('katamari') ||
    game.includes('turbo turtle adventure') ||
    game.includes('wattam') ||
    game.includes('the wonderful end of the world'),
  query: {
    usernames: [
      'boulder1145',
      'cherry_soup',
      'csaur',
      'devteamster',
      'dunewacky',
      'enzor_au',
      'euclid999',
      'forginal',
      'garbitheglitcheress',
      'harleythered',
      'harutomo',
      'hotdogturtle',
      'inightfall',
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
      'odyssic',
      'paperspine',
      'phiyrebawl',
      'pimittens',
      'pvtcb',
      'randomizerhater92',
      'rattmann_',
      'semanticallySatiated',
      'shamana',
      'sisuka7',
      'sunkir',
      'the_mountain_fox',
      'theterrifictracy',
      'xainjaya',
    ],
  },
  getFlavor: () => slots(katamariEmotes, 5),
};

export const command: Command = {
  onReady: client => {
    if (process.env.NODE_ENV === 'development') {
      onReady(client, testConfig);
    } else {
      onReady(client, katamariConfig);
      onReady(client, chestConfig);
    }
  },
};
