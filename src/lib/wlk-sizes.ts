import levenshtein from 'fast-levenshtein';
import { sortBy, zip } from 'lodash';
import { getCsvData, DATA } from './get-data';
import { parseDisplaySize } from './size-calc';

interface WlkSizeCsvRow {
  name: string;
  size: string;
}

export interface WlkObject {
  name: string;
  displaySize: string;
  size: number; // in cm
}

// ** assumes query is pre-normalized to be lower case **
const objectNameDistance = (
  object: WlkObject,
  query: string,
): Maybe<number> => {
  return levenshtein.get(object.name.toLowerCase(), query);
};

class WlkObjectDb {
  private objectList: WlkObject[];
  private searchTermIds: string[];

  constructor() {
    this.objectList = getCsvData(DATA.WLK_SIZES).reduce(
      (result: WlkObject[], row: WlkSizeCsvRow) => {
        if (row.name !== '' && row.size !== '') {
          const size = parseDisplaySize(row.size);
          if (size !== undefined) {
            result.push({
              name: row.name,
              displaySize: row.size,
              size,
            });
          }
        }

        return result;
      },
      [],
    );
  }

  // returns the list of objects whose name contains the query as a substring
  objectNamesWithSubstring(query: string): WlkObject[] {
    query = query
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    return this.objectList.filter(obj => {
      if (!obj.name) return false;
      const name = obj.name.toLowerCase().trim();
      return name !== query && name.includes(query);
    });
  }

  // returns a list of objects whose names match the query
  objectNameMatches(query: string, maxResults: number): WlkObject[] {
    // const nameTagRegex = /\s*\[\s*([\w\s]+)\s*\]\s*$/;

    let result: WlkObject[] = [];
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

      result = sortedNameDistances.map(pair => pair[0]) as WlkObject[];
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

export const wlkDb = new WlkObjectDb();

export const matchWlkSizeCommand = (command: string): boolean =>
  command.startsWith('!wlksize ');

export const handleWlkSizeCommand = (command: string): WlkObject[] => {
  const queryMatch = command.match(/!wlksize (.+)/);
  if (queryMatch === null) return [];

  const query = queryMatch[1];
  return wlkDb.objectNameMatches(query, 15);
};
