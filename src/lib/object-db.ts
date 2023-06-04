import { KDRObject, Language } from './reroll-strings';

export interface GameObject {
  englishName: string;
  monoNameIndex: number;
  pickupSize?: number; // integer (mm)
  internalName?: string;
  nameTag?: string;
  nameStrId?: string;
  descriptionStrId?: string;
  categoryStrId?: string;
  locationStrId?: string;
  unitStrId?: string;
  sizeStrId?: string;
  isCollectible?: boolean;
  isRare: boolean;
  ignoresHole?: boolean;
  volume: number; // float (m^3)
  isCountry?: boolean;
  pickupVolumePenalty?: number;
  pickupVolume?: number; // float (m^3)
}

export interface GameObjectDb<O extends GameObject = GameObject> {
  objectNameMatches(query: string, l: Language, maxResults: number): O[];
}
