import { Command } from '../../Command';
import { onReady, NotificationConfig } from './onReady';

const testConfig: NotificationConfig = {
  guildId: '572531842952200223',
  channelId: '675463218050891806',
  updateInterval: 5 * 1000,
  query: {
    usernames: ['trihex'],
  },
};

const config: NotificationConfig = {
  guildId: '232268612285497345',
  channelId: '535643965899276289',
  updateInterval: 60 * 1000,
  query: {
    usernames: [
      'dunewacky',
      'harutomo',
      'jokopoking',
      'klohinx',
      'kumasbear',
      'martini',
      'midboss2',
      'pimittens',
      'pvtcb',
      'randomizerhater92',
      'rattmann_',
    ],
  },
};

export const command: Command = {
  onReady: client =>
    onReady(
      client,
      process.env.NODE_ENV === 'development' ? testConfig : config,
    ),
};
