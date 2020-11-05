import { uniq, minBy } from 'lodash';
import levenshtein from 'fast-levenshtein';
import { stringDb, Language } from './reroll-strings';
import { DATA, getCsvData } from './get-data';

interface KDRObject {
  englishName: string;
  monoNameIndex: number;
  pickupSize: number;
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
}

interface KDRObjectDb {}

const parseNonstringFields = (obj: any): KDRObject => {
  obj.monoNameIndex = parseInt(obj.monoNameIndex);
  obj.pickupSize = parseInt(obj.pickupSize);
  obj.isCollectible = obj.isCollectible === 'TRUE';
  obj.isRare = obj.isRare === 'TRUE';
  obj.ignoresHole = obj.ignoresHole === 'TRUE';
  obj.volume = parseFloat(obj.volume);

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

const closestMatch = (
  matches: string[],
  query: string,
  maxDistance?: number,
): string | undefined => {
  const closest = minBy(matches, match => levenshtein.get(match, query));

  if (
    maxDistance === undefined ||
    levenshtein.get(closest, query) <= maxDistance
  ) {
    return closest;
  }
};

const buildObjectDb = (): KDRObjectDb => {
  const objectList: KDRObject[] = getCsvData(DATA.REROLL_OBJECTS).map(
    parseNonstringFields,
  );

  const strIds = {
    categories: uniq(objectList.map(obj => obj.categoryStrId)),
    locations: uniq(objectList.map(obj => obj.locationStrId)),
    sizes: uniq(objectList.map(obj => obj.sizeStrId)),
  };

  const searchTermIds = [
    ...strIds.categories,
    ...strIds.locations,
    ...strIds.sizes,
  ].filter(term => term !== undefined) as string[];

  const closestSearchTerm = (
    query: string,
    l: Language,
  ): string | undefined => {
    const searchTerms = searchTermIds.map(id =>
      stringDb.getString(id, l),
    ) as string[];
    return closestMatch(
      searchTerms.map(t => t.toLowerCase()),
      query.toLowerCase(),
      5,
    );
  };

  const objectDb = {};

  return objectDb;
};

buildObjectDb();
