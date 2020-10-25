import { sample, zipObject } from 'lodash';
import { DATA, getCsvData } from './get-data';

export interface KDRStringRow {
  TEXT_ID: string;
  SPEAKER?: string;
  JAPANESE?: string;
  ENGLISH?: string;
  FRENCH?: string;
  GERMAN?: string;
  ITALIAN?: string;
  SPANISH?: string;
}

export enum Language {
  JAPANESE,
  ENGLISH,
  FRENCH,
  GERMAN,
  ITALIAN,
  SPANISH,
}

export interface KDRString {
  TEXT_ID: string;
  SPEAKER?: string;
  LANGUAGE: Language;
  VALUE: string;
}

export enum Speaker {
  King,
  Mutsuo,
  Michiru,
  Mother,
  Father,
  News,
}

export interface StringDB {
  // returns a random string row with the language `l`
  randomString: (l: Language) => KDRStringRow;

  // returns a random string row with the language `l` and a nonempty
  randomSpokenString: (l: Language) => KDRStringRow;
}

type LanguageIndex = Record<Language, number[]>;

const langs = ['JAPANESE', 'ENGLISH', 'FRENCH', 'GERMAN', 'ITALIAN', 'SPANISH'];

export const langStr = (l: Language): string => langs[l];
export const parseLanguage = (s: string): Language | undefined => {
  s = s.toUpperCase();

  const l = langs.indexOf(s);
  if (l >= 0) return l;

  if (s == 'JP' || s == 'J') return Language.JAPANESE;

  return undefined;
};

/*
const rowToStr = (row: KDRStringRow, l: Language): KDRString => ({
  TEXT_ID: row.TEXT_ID,
  SPEAKER: row.SPEAKER,
  LANGUAGE: l,
  VALUE: row[langStr(l)],
});

const speakers: Record<string, Speaker> = {
  '王様': Speaker.King,
  'ムツオ(息子)': Speaker.Mutsuo,
  'ミチル(娘)': Speaker.Michiru,
  '母': Speaker.Mother,
  '父': Speaker.Father,
  'ニュース': Speaker.News,
};
*/

// mutates the KDRStringRow
const removeCodes = (s: KDRStringRow): void =>
  langs.forEach(l => {
    if (s[l] !== undefined) {
      s[l] = s[l].replace(/\{..\}/g, '').replace(/\\n/g, ' ');
    }
  });

const isNonemptyString = (s: KDRStringRow): boolean =>
  langs.some(l => s[l] !== '');

const buildLanguageIndex = (strings: KDRStringRow[]): LanguageIndex => {
  const result: LanguageIndex = zipObject(
    langs,
    langs.map(() => [] as number[]),
  ) as LanguageIndex;

  strings.forEach((s, idx) => {
    langs.forEach(l => {
      if (s[l] !== '') result[l].push(idx);
    });
  });

  return result;
};

const buildStringDb = (): StringDB => {
  const strings: KDRStringRow[] = getCsvData(DATA.REROLL_STRINGS)
    // filter out empty strings
    .filter(isNonemptyString);

  // remove formatting codes
  strings.forEach(removeCodes);

  const spokenStrings: KDRStringRow[] = strings.filter(s => s.SPEAKER !== '');

  const languageIndex: LanguageIndex = buildLanguageIndex(strings);
  const spokenLanguageIndex: LanguageIndex = buildLanguageIndex(spokenStrings);

  return {
    randomRow: (): KDRStringRow => sample(strings) as KDRStringRow,

    randomString: (l: Language) => {
      const lang = langStr(l);
      return strings[sample(languageIndex[lang])];
    },

    randomSpokenString: (l: Language) => {
      const lang = langStr(l);
      return spokenStrings[sample(spokenLanguageIndex[lang])];
    },
  };
};

export const stringDb: StringDB = buildStringDb();
