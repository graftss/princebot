import { readFileSync } from 'fs';
import { join } from 'path';
import parse from 'csv-parse/lib/sync';

export enum DATA {
  REROLL_STRINGS,
  REROLL_OBJECTS,
  WLK_SIZES,
  WLKR_OBJECTS,
}

const paths = {
  [DATA.REROLL_STRINGS]: join(__dirname, '../../data/reroll-strings.csv'),
  [DATA.REROLL_OBJECTS]: join(__dirname, '../../data/reroll-objects.csv'),
  [DATA.WLK_SIZES]: join(__dirname, '../../data/wlk-sizes.csv'),
  [DATA.WLKR_OBJECTS]: join(__dirname, '../../data/wlkr-objects.csv'),
};

const cache: Partial<{ [d in DATA]: any }> = {};

const parseCsvData = (data: DATA): any[] =>
  parse(readFileSync(paths[data]), { skip_empty_lines: true, columns: true });

export const getCsvData = (data: DATA): any[] => {
  if (cache[data] === undefined) {
    cache[data] = parseCsvData(data);
  }

  return cache[data];
};
