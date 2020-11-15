import { chain, flatMap, sample } from 'lodash';
import levenshtein from 'fast-levenshtein';
import { parseLanguage, stringDb, Language } from './reroll-strings';
import { DATA, getCsvData } from './get-data';

export interface KDRObject {
  englishName: string;
  monoNameIndex: number;
  pickupSize?: number;
  internalName: string;
  nameTag: string;
  nameStrId?: string;
  descriptionStrId?: string;
  categoryStrId?: string;
  locationStrId?: string;
  unitStrId?: string;
  sizeStrId?: string;
  isCollectible: boolean;
  isRare: boolean;
  ignoresHole: boolean;
  volume: number;
  isCountry: boolean;
}

export interface ObjectCommandResult {
  object: KDRObject;
  filter: Maybe<ObjectFilter>;
  searchIgnored: boolean;
  primaryLanguage: Language;
}

const parseNonstringFields = (obj: any): KDRObject => {
  obj.monoNameIndex = parseInt(obj.monoNameIndex);
  obj.pickupSize = parseInt(obj.pickupSize);
  obj.volume = parseFloat(obj.volume);

  // delete NaN fields
  ['monoNameIndex', 'pickupSize', 'volume'].forEach(key => {
    if (obj[key] !== obj[key]) delete obj[key];
  });

  obj.isCollectible = obj.isCollectible === 'TRUE';
  obj.isRare = obj.isRare === 'TRUE';
  obj.ignoresHole = obj.ignoresHole === 'TRUE';
  obj.isCountry = obj.internalName.startsWith('ED');

  [
    'nameStrId',
    'descriptionStrId',
    'categoryStrId',
    'locationStrId',
    'unitStrId',
    'sizeStrId',
  ].forEach(key => {
    if (obj[key] === '') delete obj[key];
  });

  return obj;
};

export const pickupSizeToString = (pickupSize: number): string => {
  let s = pickupSize;
  let result = '';

  if (s % 10 !== 0) result = `${s % 10}mm`;
  s = Math.floor(s / 10);

  if (s % 100 !== 0) result = `${s % 100}cm` + result;
  s = Math.floor(s / 100);

  if (s > 0) result = `${s}m` + result;
  return result;
};

// returns the index of the closest match in `matches`, if one is found.
// if there is a tie in edit distance between multiple matches, the lowest
// index of the tied matches is returned.
const closestMatchIndex = (
  matches: string[],
  query: string,
  maxDistance?: number,
): Maybe<number> => {
  if (query === '') return;

  let bestDistance = maxDistance ? maxDistance + 1 : Infinity;
  let result: Maybe<number>;

  matches.forEach((match, idx) => {
    const distance = levenshtein.get(match, query);

    if (distance < bestDistance) {
      bestDistance = distance;
      result = idx;
    }
  });

  return result;
};

const definedValues = (objectList: KDRObject[], key: string): string[] =>
  chain(objectList)
    .map(key)
    .uniq()
    .filter(v => v !== undefined)
    .value();

interface ObjectFilter {
  key: string;
  value: string;
}

const applyObjectFilter = (
  objects: KDRObject[],
  filter: ObjectFilter,
): KDRObject[] => objects.filter(obj => obj[filter.key] === filter.value);

export const filterToString = (filter: ObjectFilter, l: Language): string => {
  return stringDb.getString(filter.value, l) || '';
};

class KDRObjectDb {
  private objectList: KDRObject[];
  private searchTermIds: string[];

  constructor() {
    this.objectList = getCsvData(DATA.REROLL_OBJECTS)
      .map(parseNonstringFields);

    this.searchTermIds = flatMap(
      ['categoryStrId', 'locationStrId', 'sizeStrId'],
      key => definedValues(this.objectList, key),
    );
  }

  randomObjectQuery(l: Language, query: string): ObjectCommandResult {
    let relevantObjects = this.objectList;
    let filter;
    let searchIgnored = false;

    if (query !== '') {
      filter = this.closestSearchTermFilter(l, query);
      searchIgnored = filter === undefined;

      if (!searchIgnored) {
        relevantObjects = this.applyFilters([filter]);
      }
    }

    return {
      object: sample(relevantObjects) as KDRObject,
      filter,
      primaryLanguage: l,
      searchIgnored,
    };
  }

  private applyFilters(filters: ObjectFilter[] = []): KDRObject[] {
    return filters.reduce(
      (result, filter) => applyObjectFilter(result, filter),
      this.objectList,
    );
  }

  private closestSearchTermFilter(
    l: Language,
    query: string,
  ): Maybe<ObjectFilter> {
    const localTermIds = this.searchTermIds.filter(
      id => stringDb.getString(id, l) !== undefined,
    );
    const localTerms = localTermIds.map(
      id => stringDb.getString(id, l) as string,
    );

    const index = closestMatchIndex(
      localTerms.map(t => t.toLowerCase()),
      query.toLowerCase(),
      2,
    );

    if (index === undefined) return undefined;

    const id = localTermIds[index];
    const key = this.classifyIdValue(id);

    if (key === undefined) return undefined;

    return { key, value: id };
  }

  private classifyIdValue(id: string): Maybe<string> {
    if (id.startsWith('OT_CTG')) return 'categoryStrId';
    if (id.startsWith('OT_MPN')) return 'locationStrId';
    if (id.startsWith('UI_NIC')) return 'sizeStrId';
  }
}

const db = new KDRObjectDb();

const objectCommandTypes: string[] = ['!object'];

export const matchObjectCommand = (command: string): boolean =>
  objectCommandTypes.some(commandType => command.startsWith(commandType));

export const handleObjectCommand = (
  command: string,
): Maybe<ObjectCommandResult> => {
  const args = command.split(/\s+/);

  // remove command type argument
  const commandType = args.shift() as string;

  // remove (optional) language type argument, if it exists
  const parsedLang: Maybe<Language> = parseLanguage(args[0] || '');
  const lang: Language =
    parsedLang === undefined ? Language.ENGLISH : parsedLang;
  if (parsedLang !== undefined) args.shift();

  switch (commandType) {
    case '!object': {
      const query = args.join(' ');
      return db.randomObjectQuery(lang, query);
    }
  }
};
