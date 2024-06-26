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
      'blaust',
      'bonkotu25',
      'boulder1145',
      'cherry_soup',
      'csaur',
      'devteamster',
      'dsun',
      'dunewacky',
      'ekahs_2',
      'enzor_au',
      // 'esamarathon',
      // 'esamarathon2',
      'euclid999',
      'forginal',
      'freeside11',
      'game1t',
      'gamesdonequick',
      'froztbitten',
      'garbitheglitcheress',
      'harleythered',
      'harutomo',
      'holdenpnw',
      'hotdogturtle',
      'inightfall',
      'itsdavesies',
      'italyflecktarn',
      'javituesday',
      'jokopoking',
      'journeymanb',
      'kamacrimson',
      'katamarispeedruns',
      'klohinx',
      'kofize',
      'kotonebeta',
      'kumasbear',
      'lenkylad',
      'malkieriking',
      'martini',
      'midboss2',
      'mr_shasta',
      'odyssic',
      'ohsuirencito',
      'paperspine',
      'phiyrebawl',
      'pimittens',
      'powerupwithpride',
      'pvtcb',
      'randomizerhater92',
      'rattmann_',
      'rtainjapan',
      'salvokai',
      'semanticallySatiated',
      'seruran_blue',
      'shamabot',
      'shamana',
      'shookieTea',
      'sisuka7',
      'speedsimpsons',
      'sunkir',
      'syugosyugi',
      'the_mountain_fox',
      'theterrifictracy',
      'tokyogameshow1',
      'twilightpb',
      'xainjaya',
      'xephyrsg',
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
      // onReady(client, chestConfig);
    }
  },
};
