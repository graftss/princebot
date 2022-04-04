import { chain, flatMap, sample, zip, sortBy, uniqBy } from 'lodash';
import levenshtein from 'fast-levenshtein';
import { parseLanguage, stringDb, Language } from './reroll-strings';
import { DATA, getCsvData } from './get-data';

export interface KDRObject {
  englishName: string;
  monoNameIndex: number;
  pickupSize?: number; // integer (mm)
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
  volume: number; // float (m^3)
  isCountry: boolean;
  pickupVolumePenalty?: number;
  pickupVolume?: number; // float (m^3)
}

export interface ObjectCommandResult {
  object: KDRObject;
  filter: Maybe<ObjectFilter>;
  searchIgnored: boolean;
  primaryLanguage: Language;
}

export interface SizeCommandResult {
  objects: KDRObject[];
  primaryLanguage: Language;
}

const parseNonstringFields = (obj: any): KDRObject => {
  obj.monoNameIndex = parseInt(obj.monoNameIndex);
  obj.pickupSize = parseInt(obj.pickupSize);
  obj.volume = parseFloat(obj.volume);
  obj.pickupVolumePenalty = parseFloat(obj.pickupVolumePenalty);
  obj.pickupVolume = parseFloat(obj.pickupVolume);

  // delete NaN fields
  [
    'monoNameIndex',
    'pickupSize',
    'volume',
    'pickupVolume',
    'pickupVolumePenalty',
  ].forEach(key => {
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

// ** assumes query is pre-normalized to be lower case **
// returns the edit distance between the object's name in the given language
// and the search query, if the object has such a name.
// if the object doesn't have a name in that language, returns undefined
const objectNameDistance = (
  object: KDRObject,
  query: string,
  l: Language,
): Maybe<number> => {
  if (!object.nameStrId) return undefined;

  const objName = stringDb.getString(object.nameStrId, l);
  if (!objName) return undefined;

  return levenshtein.get(objName.toLowerCase(), query);
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

export class KDRObjectDb {
  private objectList: KDRObject[];
  private searchTermIds: string[];

  constructor() {
    this.objectList = getCsvData(DATA.REROLL_OBJECTS).map(parseNonstringFields);

    this.searchTermIds = flatMap(
      ['categoryStrId', 'locationStrId', 'sizeStrId'],
      key => definedValues(this.objectList, key),
    );
  }

  objectsByAttachVolume(): (KDRObject & { pickupVolume: number })[] {
    const objsWithAttachVolume = this.objectList.filter(
      obj => obj.pickupVolume !== undefined && obj.pickupVolume > 0,
    ) as (KDRObject & { pickupVolume: number })[];
    return objsWithAttachVolume.sort((a, b) => a.pickupVolume - b.pickupVolume);
  }

  objectByNameIndex(monoNameIndex: number): Maybe<KDRObject> {
    // Every object has a unique `monoNameIndex`, so `matches` should have at most one element.
    const matches = this.objectList.filter(
      obj => obj.monoNameIndex === monoNameIndex,
    );
    return matches.length > 0 ? matches[0] : undefined;
  }

  // returns the list of objects whose name contains the query as a substring
  objectNamesWithSubstring(query: string, l: Language): KDRObject[] {
    query = query.toLowerCase().replace(/\s+/g, ' ');

    return this.objectList.filter(obj => {
      const name = obj.nameStrId && stringDb.getString(obj.nameStrId, l);
      return name && name.toLowerCase().includes(query);
    });
  }

  // returns a list of objects whose names match the query
  objectNameMatches(
    query: string,
    l: Language,
    maxResults: number,
  ): KDRObject[] {
    const nameTagRegex = /\s*\[\s*([\w\s]+)\s*\]\s*$/;

    let result: KDRObject[] = [];
    const maxEditDistance = query.length <= 5 ? 1 : 2;

    // normalize the query
    query = query.toLowerCase().replace(/\s+/g, ' ');

    // check for a name tag in the query
    const nameTagMatch = query.match(nameTagRegex);
    let nameTag: Maybe<string>;
    if (nameTagMatch !== null) {
      nameTag = nameTagMatch[1].toLowerCase();
      query = query.replace(nameTagRegex, '');
    }

    const nameDistances = zip(
      this.objectList,
      this.objectList.map(obj => objectNameDistance(obj, query, l)),
    ).filter(pair => pair[1] !== undefined && pair[1] <= maxEditDistance);

    if (nameDistances.length > 0) {
      let sortedNameDistances = sortBy(nameDistances, ['1']);

      // if there's an name exactly matching the query, remove objects
      // from result set with a nonzero edit distance.
      const foundExactMatch = sortedNameDistances[0][1] === 0;
      if (foundExactMatch) {
        sortedNameDistances = sortedNameDistances.filter(pair => pair[1] === 0);
      }

      result = sortedNameDistances.map(pair => pair[0]) as KDRObject[];
    }

    if (nameTag !== undefined) {
      // return the exact name tag match if one is found
      const exactNameTagMatch = result.filter(
        obj => obj.nameTag.toLowerCase() == nameTag,
      );
      if (exactNameTagMatch.length > 0) return exactNameTagMatch;

      // otherwise, allow a typo. i don't know what i'm doing
      result = result.filter(obj => {
        if (!obj.nameTag) return false;
        return levenshtein.get(obj.nameTag.toLowerCase(), nameTag) <= 1;
      });
    }

    // pad the result set with substring matches
    return result
      .concat(this.objectNamesWithSubstring(query, l))
      .slice(0, maxResults);
  }

  objectSizeQuery(query: string, l: Language, maxResults: number): KDRObject[] {
    const matches = this.objectNameMatches(query, l, maxResults).filter(
      obj => obj.isCollectible && obj.pickupSize !== undefined,
    );

    return uniqBy(matches, obj => {
      const name = stringDb.getString(obj.nameStrId as string, l);
      const nameTag = obj.nameTag;
      const size = obj.pickupSize as number;
      return name + ';' + nameTag + ';' + size;
    });
  }

  randomCollectibleObject(): KDRObject {
    return sample(
      this.objectList.filter(obj => obj.isCollectible),
    ) as KDRObject;
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

export const db = new KDRObjectDb();

// remove (optional) language argument from argument array, if it exists
const parseLanguageArg = (args: string[]): Language => {
  const parsedLang: Maybe<Language> = parseLanguage(args[0] || '');

  if (parsedLang !== undefined) {
    args.shift();
    return parsedLang;
  }

  return Language.ENGLISH;
};

export const matchObjectCommand = (command: string): boolean =>
  command.startsWith('!object');

export const handleObjectCommand = (
  command: string,
): Maybe<ObjectCommandResult> => {
  const args = command.split(/\s+/);
  args.shift();
  const lang = parseLanguageArg(args);

  // use remaining command as query and return result
  const query = args.join(' ');
  return db.randomObjectQuery(lang, query);
};

export const matchSizeCommand = (command: string): boolean =>
  command.startsWith('!size');

export const handleSizeCommand = (command: string): SizeCommandResult => {
  const args = command.split(/\s+/);
  args.shift();
  const lang = parseLanguageArg(args);
  const query = args.join(' ');

  return {
    objects: db.objectSizeQuery(query, lang, 10),
    primaryLanguage: lang,
  };
};

export const renderObjectText = (object: KDRObject, l: Language): string => {
  let name = stringDb.getString(object.nameStrId as string, l) as string;
  if (object.nameTag !== '') name += ` [${object.nameTag}]`;
  const size = pickupSizeToString(object.pickupSize as number);
  return `${name}: ${size}`;
};
