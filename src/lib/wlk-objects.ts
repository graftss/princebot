import { sortBy, zip } from 'lodash';
import levenshtein from 'fast-levenshtein';
import { GameObject, GameObjectDb } from './object-db';
import { Language } from './reroll-strings';
import { DATA, getCsvData } from './get-data';

export type WLKObject = GameObject;

// ** assumes query is pre-normalized to be lower case **
const objectNameDistance = (
  object: WLKObject,
  query: string,
): Maybe<number> => {
  return levenshtein.get(object.englishName.toLowerCase(), query);
};

export class WLKObjectDb implements GameObjectDb<WLKObject> {
  private objectList: WLKObject[];

  constructor() {
    this.objectList = [];
    getCsvData(DATA.WLKR_OBJECTS).forEach(
      obj => (this.objectList[obj.monoNameIndex] = obj),
    );

    // fill holes in incomplete wlkr objects to match what kdr bot commands expect
    this.objectList.forEach(o => {
      o.isCollectible = true;
      if (o.pickupVolumePenalty !== undefined && o.volume !== undefined) {
        o.pickupVolume = o.pickupVolumePenalty * o.volume;
      }
    });

    this.auditObjVols();

    getCsvData(DATA.WLKR_OBJ_VOLS).forEach(p => {
      if (this.objectList[p.monoNameIndex] !== undefined) {
        this.objectList[p.monoNameIndex].pickupVolume = p.pickupVolume;
      }
    });
  }

  auditObjVols() {
    const volsByName: Record<number, string[]> = getCsvData(
      DATA.WLKR_OBJ_VOLS,
    ).reduce((table: Record<number, string[]>, next) => {
      const { monoNameIndex, pickupVolume } = next;
      if (parseFloat(pickupVolume) == 0) return table;

      if (table[monoNameIndex] === undefined) {
        table[monoNameIndex] = [pickupVolume];
      } else if (!table[monoNameIndex].includes(pickupVolume)) {
        table[monoNameIndex].push(pickupVolume);
      }
      return table;
    }, {});

    for (const nameIdx in volsByName) {
      if (volsByName[nameIdx].length > 1) {
        console.log(`big set: ${nameIdx} // ${volsByName[nameIdx].join(',')}`);
      }
    }
  }

  // returns the list of objects whose name contains the query as a substring
  objectNamesWithSubstring(query: string): WLKObject[] {
    query = query
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    return this.objectList.filter(obj => {
      if (!obj.englishName) return false;
      const name = obj.englishName.toLowerCase().trim();
      return name !== query && name.includes(query);
    });
  }

  objectNameMatches(
    query: string,
    l: Language,
    maxResults: number,
  ): WLKObject[] {
    // const nameTagRegex = /\s*\[\s*([\w\s]+)\s*\]\s*$/;

    let result: WLKObject[] = [];
    const maxEditDistance = query.length <= 5 ? 1 : 2;

    // normalize the query
    query = query.toLowerCase().replace(/\s+/g, ' ');

    // check for a name tag in the query
    // const nameTagMatch = query.match(nameTagRegex);
    // let nameTag: Maybe<string>;
    // if (nameTagMatch !== null) {
    //   nameTag = nameTagMatch[1].toLowerCase();
    //   query = query.replace(nameTagRegex, '');
    // }

    const nameDistances = zip(
      this.objectList,
      this.objectList.map(obj => objectNameDistance(obj, query)),
    ).filter(pair => pair[1] !== undefined && pair[1] <= maxEditDistance);

    if (nameDistances.length > 0) {
      let sortedNameDistances = sortBy(nameDistances, ['1']);

      // if there's an name exactly matching the query, remove objects
      // from result set with a nonzero edit distance.
      const foundExactMatch = sortedNameDistances[0][1] === 0;
      if (foundExactMatch) {
        sortedNameDistances = sortedNameDistances.filter(pair => pair[1] === 0);
      }

      result = sortedNameDistances.map(pair => pair[0]) as WLKObject[];
    }

    // if (nameTag !== undefined) {
    //   // return the exact name tag match if one is found
    //   const exactNameTagMatch = result.filter(
    //     obj => obj.nameTag.toLowerCase() == nameTag,
    //   );
    //   if (exactNameTagMatch.length > 0) return exactNameTagMatch;

    //   // otherwise, allow a typo. i don't know what i'm doing
    //   result = result.filter(obj => {
    //     if (!obj.nameTag) return false;
    //     return levenshtein.get(obj.nameTag.toLowerCase(), nameTag) <= 1;
    //   });
    // }

    // pad the result set with substring matches
    return result
      .concat(this.objectNamesWithSubstring(query))
      .slice(0, maxResults);
  }
}

export const wlkdb = new WLKObjectDb();
