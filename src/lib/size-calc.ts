import { db, KDRObject } from './reroll-objects';
import { Language } from './reroll-strings';

enum MISSION {
  MAS1 = 'MAS1',
  MAS2 = 'MAS2',
  MAS3 = 'MAS3',
  MAS4 = 'MAS4',
  MAS5 = 'MAS5',
  MAS6 = 'MAS6',
  MAS7 = 'MAS7',
  MAS8 = 'MAS8',
  MAS9 = 'MAS9',
  MTM = 'MTM',
  CANCER = 'CANCER',
  CYGNUS = 'CYGNUS',
  CORONA = 'CORONA',
  PISCES = 'PISCES',
  VIRGO = 'VIRGO',
  URSA = 'URSA',
  GEMINI = 'GEMINI',
  TAURUS = 'TAURUS',
  NORTH_STAR = 'NORTH_STAR',
  ETERNAL1 = 'ETERNAL1',
  ETERNAL2 = 'ETERNAL2',
  ETERNAL3 = 'ETERNAL3',
}

const MAS_MISSIONS: Maybe<MISSION>[] = [
  undefined,
  MISSION.MAS1,
  MISSION.MAS2,
  MISSION.MAS3,
  MISSION.MAS4,
  MISSION.MAS5,
  MISSION.MAS6,
  MISSION.MAS7,
  MISSION.MAS8,
  MISSION.MAS9,
];

interface MissionSizeData {
  key: MISSION;
  names: string[];
  initDiam: number;
  multiplierControls: number[];
}

interface ObjectListElement {
  obj: Maybe<KDRObject>;
  quantity: number;
}

const NO_MATCH: ObjectListElement = {
  obj: undefined,
  quantity: 0,
};

const MISSION_SIZE_DATA: Record<MISSION, MissionSizeData> = {
  [MISSION.MAS1]: {
    key: MISSION.MAS1,
    names: ['mas1'],
    initDiam: 5,
    multiplierControls: [0, 1, 10, 1, 15, 0.5, 20, 0.2, 30, 0.1],
  },
  [MISSION.MAS2]: {
    key: MISSION.MAS2,
    names: ['mas2'],
    initDiam: 5,
    multiplierControls: [0, 1, 10, 1, 20, 0.9, 30, 0.5, 40, 0.1],
  },
  [MISSION.MAS3]: {
    key: MISSION.MAS3,
    names: ['mas3'],
    initDiam: 10,
    multiplierControls: [0, 1, 50, 1, 75, 0.5, 100, 0.2, 160, 0.01],
  },
  [MISSION.MAS4]: {
    key: MISSION.MAS4,
    names: ['mas4'],
    initDiam: 5,
    multiplierControls: [
      0,
      1,
      50,
      1,
      100,
      0.6,
      110,
      0.4,
      120,
      0.25,
      125,
      0.15,
      130,
      0.1,
      135,
      0,
      160,
      0,
    ],
  },
  [MISSION.MAS5]: {
    key: MISSION.MAS5,
    names: ['mas5'],
    initDiam: 10,
    multiplierControls: [0, 1, 150, 1, 200, 0.5, 250, 0.2, 300, 0.1, 500, 0.01],
  },
  [MISSION.MAS6]: {
    key: MISSION.MAS6,
    names: ['mas6'],
    initDiam: 50,
    multiplierControls: [
      0,
      1,
      50,
      1,
      100,
      1,
      200,
      0.9,
      300,
      0.9,
      500,
      0.7,
      600,
      0.7,
      700,
      0.6,
      800,
      0.1,
    ],
  },
  [MISSION.MAS7]: {
    key: MISSION.MAS7,
    names: ['mas7'],
    initDiam: 50,
    multiplierControls: [
      0,
      1,
      50,
      1.1,
      100,
      1,
      300,
      1,
      500,
      1,
      600,
      1,
      700,
      1,
      800,
      1,
      900,
      0.6,
      1000,
      0.2,
      1100,
      0.1,
    ],
  },
  [MISSION.MAS8]: {
    key: MISSION.MAS8,
    names: ['mas8'],
    initDiam: 10,
    multiplierControls: [
      0,
      1,
      10,
      1.1,
      20,
      1.2,
      50,
      1,
      1000,
      1,
      1200,
      0.8,
      2000,
      0.7,
      2500,
      0.6,
      3000,
      0.3,
    ],
  },
  [MISSION.MAS9]: {
    key: MISSION.MAS9,
    names: ['mas9'],
    initDiam: 50,
    multiplierControls: [
      0,
      1,
      50,
      1,
      300,
      1.2,
      1000,
      1,
      2000,
      0.6,
      3000,
      0.8,
      4000,
      0.8,
      4500,
      0.6,
      500,
      0.4,
      5500,
      0.2,
      6000,
      0.1,
    ],
  },
  [MISSION.MTM]: {
    key: MISSION.MTM,
    names: ['moon', 'mtm'],
    initDiam: 100,
    multiplierControls: [
      0,
      1,
      50,
      1,
      100,
      1,
      1000,
      1,
      10000,
      1.1,
      20000,
      0.9,
      30000,
      0.9,
      40000,
      1,
      50000,
      1,
      60000,
      1,
      70000,
      0.8,
      80000,
      0.7,
      90000,
      0.5,
    ],
  },
  [MISSION.CANCER]: {
    key: MISSION.CANCER,
    names: ['cancer', 'crab', 'crabs'],
    initDiam: 22.2,
    multiplierControls: [0, 1, 10, 1, 30, 1, 50, 0.5, 60, 0.3, 65, 0.1, 70, 0],
  },
  [MISSION.CYGNUS]: {
    key: MISSION.CYGNUS,
    names: ['cygnus', 'swan', 'swans'],
    initDiam: 13.9,
    multiplierControls: [
      0,
      1,
      13,
      0.2,
      30,
      0.2,
      50,
      0.01,
      100,
      0.01,
      160,
      0.01,
    ],
  },
  [MISSION.CORONA]: {
    key: MISSION.CORONA,
    names: ['corona', 'crowns', 'crown'],
    initDiam: 55.5,
    multiplierControls: [
      0,
      1,
      40,
      0.7,
      70,
      0.6,
      100,
      0.5,
      150,
      0.4,
      200,
      0.3,
      500,
      0.3,
    ],
  },
  [MISSION.PISCES]: {
    key: MISSION.PISCES,
    names: ['pisces', 'fish'],
    initDiam: 99.9,
    multiplierControls: [
      0,
      1,
      80,
      0.9,
      100,
      0.8,
      120,
      0.7,
      170,
      0.6,
      220,
      0.5,
      250,
      0.3,
      300,
      0.2,
    ],
  },
  [MISSION.VIRGO]: {
    key: MISSION.VIRGO,
    names: ['virgo', 'maidens', 'maiden'],
    initDiam: 111.1,
    multiplierControls: [
      0,
      1,
      100,
      0.95,
      120,
      0.85,
      150,
      0.6,
      180,
      0.5,
      220,
      0.4,
      250,
      0.3,
      300,
      0.2,
      350,
      0.1,
      450,
      0.05,
    ],
  },
  [MISSION.URSA]: {
    key: MISSION.URSA,
    names: ['ursa', 'ursa major', 'bear'],
    initDiam: 151.5,
    multiplierControls: [0, 1, 10, 1, 20, 1, 50, 1, 100, 1, 160, 1],
  },
  [MISSION.GEMINI]: {
    key: MISSION.GEMINI,
    names: ['gemini', 'twin', 'twins'],
    initDiam: 88.8,
    multiplierControls: [
      0,
      1,
      10,
      1,
      20,
      1,
      50,
      1,
      100,
      0.8,
      150,
      0.8,
      200,
      0.8,
      300,
      0.8,
      400,
      0.6,
      500,
      0.2,
    ],
  },
  [MISSION.TAURUS]: {
    key: MISSION.TAURUS,
    names: ['taurus', 'cow'],
    initDiam: 111.1,
    multiplierControls: [0, 1, 100, 1, 200, 1, 300, 1, 400, 1, 500, 1],
  },
  [MISSION.NORTH_STAR]: {
    key: MISSION.NORTH_STAR,
    names: ['north star', 'north', 'polaris'],
    initDiam: 300,
    multiplierControls: [0, 1, 1000, 0.8, 1150, 0.5, 1300, 0.1],
  },
  [MISSION.ETERNAL1]: {
    key: MISSION.ETERNAL1,
    names: ['e1', 'eternal1', 'et1'],
    initDiam: 5,
    multiplierControls: [
      0,
      1,
      50,
      1,
      100,
      0.6,
      100,
      0.4,
      120,
      0.25,
      125,
      0.15,
      130,
      0.1,
      135,
      0,
      160,
      0,
    ],
  },
  [MISSION.ETERNAL2]: {
    key: MISSION.ETERNAL2,
    names: ['e2', 'eternal2', 'et2'],
    initDiam: 10,
    multiplierControls: [
      0,
      1,
      10,
      1.1,
      20,
      1.2,
      50,
      1,
      1000,
      1,
      1200,
      0.8,
      2000,
      0.7,
      2500,
      0.5,
      3000,
      0.3,
    ],
  },
  [MISSION.ETERNAL3]: {
    key: MISSION.ETERNAL3,
    names: ['e3', 'eternal3', 'et3'],
    initDiam: 100,
    multiplierControls: [
      0,
      1,
      50,
      1,
      100,
      1,
      1000,
      1,
      10000,
      1.1,
      20000,
      0.9,
      30000,
      0.9,
      40000,
      1,
      50000,
      1,
      60000,
      0.9,
      70000,
      0.7,
      80000,
      0.4,
      90000,
      0.05,
    ],
  },
};

const _4piOver3: number = (Math.PI * 4) / 3;
const _3Over4pi: number = 1 / _4piOver3;
const FUDGE = 0.02;

// volumes are in m^3, diameters are in cm
const volToDiam = (vol: number): number =>
  Math.pow(vol * _3Over4pi, 0.3333333) * 200 + FUDGE;

const diamToVol = (diam: number): number =>
  Math.pow((diam - FUDGE) / 200, 3) * _4piOver3;

const lerp = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
): number => y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);

// computes the size multiplier in `mission` at the diameter `diam`
const missionSizeMultiplier = (mission: MISSION, diam: number): number => {
  const controls: number[] = MISSION_SIZE_DATA[mission].multiplierControls;
  for (let i = 0; i < controls.length; i += 2) {
    // find the first control diameter that exceeds the input diameter
    if (controls[i] > diam) {
      return lerp(
        controls[i - 2],
        controls[i - 1],
        controls[i],
        controls[i + 1],
        diam,
      );
    }
  }

  // if the input diameter exceeds the last control diameter (this never happens
  // under unmodified gameplay), return the last multiplier
  return controls[controls.length - 1];
};

// const objectMatch = (name: string, lang: Language): Maybe<KDRObject> => {
//   const matches = db
//     .objectNameMatches(name, lang, 10)
//     .filter(obj => obj.isCollectible);
//   return matches.length === 0 ? undefined : matches[0];
// };

// an object list element can yield one object multiple times,
// eg "carp streamer x3" to denote three carp streamers
const parseObjectListElt = (elt: string, lang: Language): ObjectListElement => {
  // look for "x{number}" at the end of the object list element
  const match = elt.match(/\s+x(\s+)?(\d+)$/);
  let quantity = 1;
  let objName: string = elt;

  if (match) {
    quantity = parseInt(match[2]) || 1;
    objName = elt.replace(match[0], '');
  }

  const objMatches = db
    .objectNameMatches(objName, lang, 10)
    .filter(obj => obj.isCollectible);

  if (objMatches.length === 0) return NO_MATCH;

  return {
    obj: objMatches[0],
    quantity,
  };
};

const parseObjectList = (str: string, lang: Language): ObjectListElement[] => {
  const elts = str.split(/\s*,\s*/);
  return elts.map(elt => parseObjectListElt(elt, lang));
};

const addObjectList = (
  mission: MISSION,
  initDiam: number,
  objList: ObjectListElement[],
): number => {
  let diam: number = initDiam;
  let volume: number = diamToVol(initDiam);

  objList.forEach(elt => {
    if (elt.obj === undefined) return;

    for (let i = 0; i < elt.quantity; i++) {
      const multiplier = missionSizeMultiplier(mission, diam);
      volume += (elt.obj.pickupVolume as number) * multiplier;
      diam = volToDiam(volume);
    }
  });

  return diam;
};

const subtractObjectList = (
  mission: MISSION,
  finalDiam: number,
  objList: ObjectListElement[],
): number => {
  const MAX_ITER = 30;
  const TOLERANCE = 0.00001;

  // just binary search to find the desired initial diameter.
  // solving for it analytically would be pointless.
  let low: number = MISSION_SIZE_DATA[mission].initDiam;
  let high: number = finalDiam;
  let guess: number = finalDiam;

  for (let i = 0; i < MAX_ITER; i++) {
    guess = (low + high) / 2;

    const finalFromGuess = addObjectList(mission, guess, objList);
    if (Math.abs(finalFromGuess - finalDiam) < TOLERANCE) return guess;

    if (finalFromGuess < finalDiam) {
      low = guess;
    } else {
      high = guess;
    }
  }

  return guess;
};

const printObjectListElement = (elt: ObjectListElement): string => {
  if (elt.obj === undefined) return '??? (x0)';

  const { nameTag, englishName } = elt.obj;

  const nameTagStr = nameTag ? ` [${nameTag}] ` : '';
  return `${englishName}${nameTagStr}(x${elt.quantity})`;
};

const printObjectList = (objList: ObjectListElement[]): string => {
  return objList.map(printObjectListElement).join(', ');
};

const parseMission = (str: string): Maybe<MISSION> => {
  for (const key in MISSION_SIZE_DATA) {
    if (MISSION_SIZE_DATA[key as MISSION].names.includes(str)) {
      return key as MISSION;
    }
  }
};

// return value in cm
export const parseDisplaySize = (str: string): Maybe<number> => {
  const match = str.match(/^(?:(?:(\d+)m)?(?:(\d+)cm)?(?:(\d+)mm)?)$/);
  if (match === null) return undefined;

  let result = 0;

  if (match[1] !== undefined) result += 100 * parseInt(match[1]);
  if (match[2] !== undefined) result += 1 * parseInt(match[2]);
  if (match[3] !== undefined) result += 0.1 * parseInt(match[3]);

  return result;
};

export const parseCmLiteralSize = (str: string): Maybe<number> => {
  return str.match(/^\d+(\.\d+)?$/) ? parseFloat(str) : undefined;
};

interface TargetSize {
  cm: number;
  objName?: string;
}

const printCm = (cm: number, mmPrecision = 0): string => {
  let result = '';
  let s = cm * 10;

  if (s % 10 !== 0) {
    const mmStr =
      mmPrecision === 0
        ? Math.floor(s % 10)
        : (s % 10).toPrecision(mmPrecision);
    result = `${mmStr}mm`;
  }
  s = Math.floor(s / 10);

  if (s % 100 !== 0 || result !== '') result = `${s % 100}cm` + result;
  s = Math.floor(s / 100);

  if (s > 0) result = `${s}m` + result;
  return result;
};

const printTargetSize = (ts: TargetSize): string => {
  const displaySize: string = printCm(ts.cm);
  return ts.objName === undefined
    ? displaySize
    : `${ts.objName} (${displaySize})`;
};

// return value in cm
const parseTargetSize = (str: string, lang: Language): Maybe<TargetSize> => {
  // try to parse a display size (e.g. 1m2cm3mm).
  const display = parseDisplaySize(str);
  if (display !== undefined) return { cm: display };

  // try to parse a cm literal (e.g. 123.4).
  const cmLiteral = parseCmLiteralSize(str);
  if (cmLiteral !== undefined) return { cm: cmLiteral };

  // finally, try to parse an object's name.
  const objMatches = db
    .objectNameMatches(str, lang, 10)
    .filter(obj => obj.isCollectible);

  if (objMatches.length > 0) {
    const obj = objMatches[0];
    const objName =
      obj.nameTag === undefined || obj.nameTag.length == 0
        ? obj.englishName
        : obj.englishName + ` [${obj.nameTag}]`;

    return {
      cm: (obj.pickupSize as number) / 10,
      objName,
    };
  }
};

enum OPERAND {
  PLUS = 'PLUS',
  MINUS = 'MINUS',
}

const parseOperand = (str: string): Maybe<OPERAND> => {
  switch (str) {
    case '+':
      return OPERAND.PLUS;
    case '-':
      return OPERAND.MINUS;
  }
};

export const matchCalcCommand = (query: string): boolean =>
  query.startsWith('!calc');

export const handleCalcCommand = (query: string): string => {
  const lang: Language = Language.ENGLISH;
  const queryRegex = /^!calc\s+([\w ]+)\s*:\s*([^-+]+)\s*([-+])\s*(.*)$/;

  const match = query.match(queryRegex);
  if (match === null) {
    return (
      `Couldn't parse !calc command. Correct format:  \n\n` +
      `!calc [level]: [starting object/size] [+ or -] [comma-separated objects with optional quantity (e.g. "rake, candy")]`
    );
  }

  // trim whitespace off the ends of each capture group
  // in a stupid, lazy way
  const [_, missionStr, targetStr, operandStr, objListStr] = match.map(s =>
    s.trim(),
  );

  const mission: Maybe<MISSION> = parseMission(missionStr);
  if (mission === undefined) {
    return `Couldn't parse game level: ${missionStr}.`;
  }

  const targetSize: Maybe<TargetSize> = parseTargetSize(targetStr, lang);
  if (targetSize === undefined) {
    return `Couldn't parse base size: ${targetStr}`;
  }

  const operand: Maybe<OPERAND> = parseOperand(operandStr);
  if (operand === undefined) return `Couldn't parse operand: ${operandStr}`;

  const objList: ObjectListElement[] = parseObjectList(objListStr, lang);

  switch (operand) {
    case OPERAND.PLUS: {
      const resultSize = addObjectList(mission, targetSize.cm, objList);
      const resultStr = printCm(resultSize, 4);

      return (
        `(${mission}): ${printTargetSize(targetSize)} + ` +
        `${printObjectList(objList)} = [[${resultStr}]]`
      );
    }

    case OPERAND.MINUS: {
      const resultSize = subtractObjectList(mission, targetSize.cm, objList);
      const resultStr = printCm(resultSize, 4);

      return (
        `(${mission}): [[${resultStr}]] + ` +
        `${printObjectList(objList)} = ${printTargetSize(targetSize)}`
      );
    }
  }
};

export const matchVsCommand = (query: string): boolean =>
  query.startsWith('!vs');

const sumVolumeReducer = (result: number, elt: ObjectListElement): number =>
  elt.obj === undefined || elt.obj.pickupVolume === undefined
    ? result
    : result + elt.quantity * elt.obj.pickupVolume;

export const handleVsCommand = (query: string): string => {
  const SEPARATOR = 'vs';
  const LANG = Language.ENGLISH;
  const tokens = query.split(/\s+/);
  const separatorIdx = tokens.map(s => s.toLowerCase()).indexOf(SEPARATOR);

  // error handling for no separator
  if (separatorIdx === -1) {
    return (
      `Couldn't parse !vs command. Correct format: \n\n` +
      `!vs [objects] VS [objects]`
    );
  }

  // leave out the first token, which should be "!vs"
  const leftTokens = tokens.slice(1, separatorIdx).join(' ');
  const rightTokens = tokens.slice(separatorIdx + 1).join(' ');

  // error handling for empty right token list
  if (rightTokens.length === 0) {
    return (
      `Couldn't parse !vs command. Correct format: \n\n` +
      `!vs [objects] VS [objects]`
    );
  }

  const leftList = parseObjectList(leftTokens, LANG);
  const rightList = parseObjectList(rightTokens, LANG);

  const leftStr = printObjectList(leftList);
  const rightStr = printObjectList(rightList);

  // error handling for unparsed objects
  if (leftList.some(elt => elt.obj === undefined)) {
    return `Couldn't parse left side: ${leftStr}`;
  } else if (rightList.some(elt => elt.obj === undefined)) {
    return `Couldn't parse right side: ${rightStr}`;
  }

  const leftVol = leftList.reduce(sumVolumeReducer, 0);
  const rightVol = rightList.reduce(sumVolumeReducer, 0);

  const leftBigger = leftVol > rightVol;
  const volRatio = leftBigger ? leftVol / rightVol : rightVol / leftVol;
  const comparePct = Math.floor(volRatio * 1000) / 10;
  const compareStr = leftBigger
    ? `Left is **${comparePct}%** of right.`
    : `Right is **${comparePct}%** of left.`;

  return [
    `Left volume: **${leftVol}** [${leftStr}]`,
    `Right volume: **${rightVol}** [${rightStr}]`,
    compareStr,
  ].join('\n\n');
};

/*example commands
  handleCalcCommand(
    '!calc moon: starfish island - anchor island'
  );

  handleCalcCommand(
    `!calc mas7: garbage - kid's tricycle x9, welcome mat`
  );


*/
