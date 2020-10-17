import tmi from 'tmi.js';

export interface MessageTags {
  color: string;
  'custom-reward-id'?: string;
  'display-name': string;
  emotes: boolean;
  flags: boolean;
  id: string;
  mod: string;
  'room-id': string;
  subscriber: string;
  turbo: string;
  'user-id': string;
  'user-type': boolean;
}

export interface Message {
  channel: string;
  text: string;
  sender: string;
}

export type Command = (
  client: tmi.Client,
  message: Message,
  tags: MessageTags,
) => void;
