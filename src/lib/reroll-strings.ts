import { sample, zipObject } from 'lodash';
import { DATA, getCsvData } from './get-data';

export interface KDRStringRow {
  TEXT_ID: string;
  SPEAKER: string;
  JAPANESE: string;
  ENGLISH: string;
  FRENCH: string;
  GERMAN: string;
  ITALIAN: string;
  SPANISH: string;
}

export enum Language {
  JAPANESE,
  ENGLISH,
  FRENCH,
  GERMAN,
  ITALIAN,
  SPANISH,
}

export enum Speaker {
  King,
  Mutsuo,
  Michiru,
  Mother,
  Father,
  News,
}

type LanguageIndex = Record<Language, number[]>;

const englishSpeakers: Record<string, string> = {
  王様: 'King',
  'ムツオ(息子)': 'Mutsuo',
  'ミチル(娘)': 'Michiru',
  母: 'Mother',
  父: 'Father',
  ニュース: 'News',
};

export interface StringDB {
  // returns a random string row with the language `l`
  randomString: (l: Language) => KDRStringRow;

  // returns a random string row with the language `l` and a nonempty
  randomSpokenString: (l: Language) => KDRStringRow;
}

const langs = ['JAPANESE', 'ENGLISH', 'FRENCH', 'GERMAN', 'ITALIAN', 'SPANISH'];

export const langStr = (l: Language): string => langs[l];
export const parseLanguage = (s: string): Language | undefined => {
  s = s.toUpperCase();

  const l = langs.indexOf(s);
  if (l >= 0) return l;

  if (s == 'JP' || s == 'J') return Language.JAPANESE;

  return undefined;
};

export const printKdrString = (s: KDRStringRow, l: Language): string => {
  const lang = langStr(l);
  const speakerStr =
    l === Language.ENGLISH ? englishSpeakers[s.SPEAKER] : s.SPEAKER;

  return s.SPEAKER !== '' ? `"${s[lang]}" -${speakerStr}` : s[lang];
};

/*
const rowToStr = (row: KDRStringRow, l: Language): KDRString => ({
  TEXT_ID: row.TEXT_ID,
  SPEAKER: row.SPEAKER,
  LANGUAGE: l,
  VALUE: row[langStr(l)],
});
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

const stringDb: StringDB = buildStringDb();

const parseLangFromArgs = (args: string[]): Language => {
  if (args.length < 2) return Language.ENGLISH;
  const l = parseLanguage(args[1]);
  return l == undefined ? Language.ENGLISH : l;
};

export const matchQuoteCommand = (text: string): boolean =>
  text.startsWith('!quote');

export const handleQuoteCommand = (text: string): string => {
  const args = text.split(/\s+/);

  const l: Language = parseLangFromArgs(args);
  const row: KDRStringRow = text.startsWith('!quote')
    ? stringDb.randomSpokenString(l)
    : stringDb.randomString(l);

  let msg: string;

  if (l === Language.ENGLISH) {
    msg = printKdrString(row, Language.ENGLISH);
  } else {
    msg = printKdrString(row, l);

    if (row.ENGLISH !== '') {
      msg += `\n\n(${printKdrString(row, Language.ENGLISH)})`;
    }
  }

  return msg;
};
