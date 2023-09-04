import { GameObject, GameObjectDb } from '../object-db';
import { db, KDRObject, KDRObjectDb } from '../reroll-objects';
import { Language } from '../reroll-strings';
import { diamToVol, printCm, squashDiam, volToDiam } from '../util';
import { wlkdb } from '../wlk-objects';
import { KD_VOLRATES } from './kd';
import { WLK_VOLRATES } from './wlk';

const MAX_OBJECT_LIST_ELT_QUANTITY = 100;

export enum GAME {
  KD = 'KD',
  WLK = 'WLK,',
}

const GAME_DATA: Record<GAME, VolRatesRecord> = {
  [GAME.KD]: KD_VOLRATES,
  [GAME.WLK]: WLK_VOLRATES,
};

const GAME_DBS: Record<GAME, GameObjectDb> = {
  [GAME.KD]: db,
  [GAME.WLK]: wlkdb,
};

// `M` should be an enum type for all possible missions
export interface MissionSizeData<M = string> {
  key: M;
  names: string[];
  initDiam?: number;
  multiplierControls: number[];
}

export type VolRatesRecord<M extends string = string> = Record<
  M,
  MissionSizeData<M>
>;

interface ObjectListElement {
  obj: Maybe<GameObject>;
  quantity: number;
}

const NO_MATCH: ObjectListElement = {
  obj: undefined,
  quantity: 0,
};

const lerp = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
): number => y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);

// computes the size multiplier in `mission` at the diameter `diam`
const missionSizeMultiplier = (
  mission: MissionSizeData,
  diam: number,
): number => {
  const controls: number[] = mission.multiplierControls;
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
const parseObjectListElt = (
  elt: string,
  lang: Language,
  db: GameObjectDb,
): ObjectListElement => {
  let objName: string = elt;

  // try to parse a [size hint] in square brackets
  const sizeHintMatch = objName.match(/\[\s*(.*)\s*\]/);
  let sizeHint: Maybe<TargetSize> = undefined;
  if (sizeHintMatch !== null) {
    sizeHint = parseTargetSize(sizeHintMatch[1], lang);
    objName = objName.replace(sizeHintMatch[0], '');
  }

  // look for "x{number}" at the end of the object list element
  const quantityMatch = objName.match(/\s+x(\s+)?(\d+)$/);
  let quantity = 1;

  if (quantityMatch) {
    quantity = parseInt(quantityMatch[2]) || 1;
    quantity = Math.min(quantity, MAX_OBJECT_LIST_ELT_QUANTITY);
    objName = objName.replace(quantityMatch[0], '');
  }

  const objMatches = db
    .objectNameMatches(objName, lang, 10)
    .filter(obj => obj.isCollectible);

  if (objMatches.length === 0) return NO_MATCH;

  let objMatch = objMatches[0];
  if (sizeHint !== undefined) {
    // object pickup sizes are stored in mm
    const targetSize = sizeHint.cm * 10;

    // search for the object with the pickup size nearest to the size hint, if one was given
    objMatch = objMatches.reduce((result, next) => {
      if (next.pickupSize === undefined) return result;
      // return the object out of `next` and `result` whose pickup size is closer to `targetSize`
      return Math.abs(next.pickupSize - targetSize) <
        Math.abs(result.pickupSize! - targetSize)
        ? next
        : result;
    });
  }

  return {
    obj: objMatch,
    quantity,
  };
};

const parseObjectList = (
  str: string,
  lang: Language,
  db: GameObjectDb,
): ObjectListElement[] => {
  const elts = str.split(/\s*,\s*/);
  return elts.map(elt => parseObjectListElt(elt, lang, db));
};

const addObjectList = (
  mission: MissionSizeData,
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
  mission: MissionSizeData,
  finalDiam: number,
  objList: ObjectListElement[],
): number => {
  const MAX_ITER = 30;
  const TOLERANCE = 0.00001;

  // just binary search to find the desired initial diameter.
  // solving for it analytically would be pointless.
  let low: number = mission.initDiam || 0;
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
  if (elt.obj === undefined) return '???';

  const {
    obj: { nameTag, englishName },
    quantity,
  } = elt;

  const nameTagStr = nameTag ? ` [${nameTag}]` : '';
  const quantityStr = quantity === 1 ? '' : ` x${quantity}`;
  return `${englishName}${nameTagStr}${quantityStr}`;
};

const printObjectList = (objList: ObjectListElement[]): string => {
  return objList.map(printObjectListElement).join(', ');
};

const parseMission = <M extends string>(
  data: VolRatesRecord<M>,
  str: string,
): Maybe<M> => {
  for (const key in data) {
    if (data[key as M].names.includes(str) || str === key) {
      return key as M;
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
  // the target size in cm.
  cm: number;

  // true if the target size is based on an object.
  objName?: string;

  // true if the target size is based on an object's squash size.
  // if false, the target size is instead based on the object's usual pickup size.
  squash?: boolean;
}

const printTargetSize = (ts: TargetSize): string => {
  const displaySize: string = printCm(ts.cm);
  if (ts.objName && ts.squash) {
    return `SQUASH(${ts.objName}) (${displaySize})`;
  } else if (ts.objName) {
    return `${ts.objName} (${displaySize})`;
  } else {
    return displaySize;
  }
};

// return value in cm
export const parseTargetSize = (
  str: string,
  lang: Language,
): Maybe<TargetSize> => {
  // try to parse a display size (e.g. 1m2cm3mm).
  const display = parseDisplaySize(str);
  if (display !== undefined) return { cm: display };

  // try to parse a cm literal (e.g. 123.4).
  const cmLiteral = parseCmLiteralSize(str);
  if (cmLiteral !== undefined) return { cm: cmLiteral };

  let objName = str;

  // try to parse a `squash([object name])` expression
  let squash = false;
  const squashMatch = str.match(/squash\((.*)\)/i);
  if (squashMatch) {
    objName = squashMatch[1];
    squash = true;
  }

  // finally, try to parse an object's name.
  const objMatches = db
    .objectNameMatches(objName, lang, 10)
    .filter(obj => obj.isCollectible);

  if (objMatches.length > 0) {
    const obj = objMatches[0];
    const objName =
      obj.nameTag === undefined || obj.nameTag.length == 0
        ? obj.englishName
        : obj.englishName + ` [${obj.nameTag}]`;

    const cm = squash
      ? squashDiam(obj.volume)
      : (obj.pickupSize as number) / 10;

    return { cm, objName, squash };
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

const formatResultSize = (size: string): string => `**${size}**`;

export const handleCalcCommand = (query: string, game: GAME): string => {
  const gameData = GAME_DATA[game];
  const gameObjDb = GAME_DBS[game];
  const lang: Language = Language.ENGLISH;
  const queryRegex = /^\s*\!calc\s+([\w ]+)\s*:\s*([^-+]+)\s*([-+])\s*(.*)$/;

  const match = query.match(queryRegex);
  if (match === null) {
    return (
      `Couldn't parse !calc command. Correct format:  \n\n` +
      `!calc [level]: [starting object/size] [+ or -] [comma-separated objects (e.g. "rake x2, candy")]`
    );
  }

  // trim whitespace off the ends of each capture group
  // in a stupid, lazy way
  const [_, missionStr, targetStr, operandStr, objListStr] = match.map(s =>
    s.trim(),
  );

  const mission = parseMission(gameData, missionStr);
  if (mission === undefined) {
    return `Couldn't parse game level: ${missionStr}.`;
  }

  const targetSize: Maybe<TargetSize> = parseTargetSize(targetStr, lang);
  if (targetSize === undefined) {
    return `Couldn't parse base size: ${targetStr}`;
  }

  const operand: Maybe<OPERAND> = parseOperand(operandStr);
  if (operand === undefined) return `Couldn't parse operand: ${operandStr}`;

  const objList: ObjectListElement[] = parseObjectList(
    objListStr,
    lang,
    gameObjDb,
  );
  const missionData: MissionSizeData = gameData[mission];

  switch (operand) {
    case OPERAND.PLUS: {
      const resultSize = addObjectList(missionData, targetSize.cm, objList);
      const resultStr = printCm(resultSize, 7);

      return (
        `**${mission}**: ${printTargetSize(targetSize)} + ` +
        `${printObjectList(objList)} = ${formatResultSize(resultStr)}`
      );
    }

    case OPERAND.MINUS: {
      const resultSize = subtractObjectList(
        missionData,
        targetSize.cm,
        objList,
      );
      const resultStr = printCm(resultSize, 4);

      return (
        `(${mission}): ${formatResultSize(resultStr)} + ` +
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

const vsCommandErrorString: string =
  `Couldn't parse !vs command. Correct format: !vs [comma-separated objects] VS [comma-separated objects]. \n\n` +
  `Example: !vs shopping cart, lucky cat x2 VS turnip x3, flower basket [yellow], flower basket [blue].`;

export const handleVsCommand = (query: string, game: GAME): string => {
  const GAME_OBJ_DB = GAME_DBS[game];
  const SEPARATOR = 'vs';
  const LANG = Language.ENGLISH;
  const tokens = query.split(/\s+/);
  const separatorIdx = tokens.map(s => s.toLowerCase()).indexOf(SEPARATOR);

  // error handling for no separator
  if (separatorIdx === -1) return vsCommandErrorString;

  // leave out the first token, which should be "!vs"
  const leftTokens = tokens.slice(1, separatorIdx).join(' ');
  const rightTokens = tokens.slice(separatorIdx + 1).join(' ');

  // error handling for empty right token list
  if (rightTokens.length === 0) return vsCommandErrorString;

  const leftList = parseObjectList(leftTokens, LANG, GAME_OBJ_DB);
  const rightList = parseObjectList(rightTokens, LANG, GAME_OBJ_DB);

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

export const matchAnalogyCommand = (query: string): boolean =>
  query.startsWith('!analogy ');

// Parse one of the four size terms in the !analogy command.
// If the term is '?', returns '?'.
// Otherwise, the term should represent a size, and that size is returned (in cm).
export const parseAnalogyTermSize = (
  term: string,
  lang: Language = Language.ENGLISH,
): Maybe<number | '?'> => {
  if (term === '?') return '?';

  const targetSize: Maybe<TargetSize> = parseTargetSize(term, lang);
  if (targetSize !== undefined) return targetSize.cm;

  // TODO: parse !calc expressions like `girl - chicken`
};

const analogyCommandErrorStr: string =
  `Couldn't parse !analogy command. Correct format:\n\n` +
  `!analogy [level]: [size]:[size]::[size or ?]:[size or ?]\n\n` +
  `Example: !analogy mas7: 165.4:88cm9mm :: girl:?`;

class VolumeDifferenceSolver {
  private MAGNITUDE = 10;
  private objectsByMagnitude: (KDRObject & { pickupVolume: number })[];

  // TODO: make this a `GameObjectDb`
  constructor(db: KDRObjectDb) {
    this.initObjectsByMagnitude(db);
  }

  private initObjectsByMagnitude(db: KDRObjectDb): void {
    const objs = db.objectsByAttachVolume();

    this.objectsByMagnitude = [];
    this.objectsByMagnitude.push(objs[0]);
    let nextVolCutoff: number = objs[0].pickupVolume * this.MAGNITUDE;

    for (let i = 1; i < objs.length; i++) {
      const obj = objs[i];
      if (obj.pickupVolume > nextVolCutoff) {
        const lastObj = objs[i - 1];
        this.objectsByMagnitude.push(lastObj);
        nextVolCutoff = lastObj.pickupVolume * this.MAGNITUDE;
      }
    }

    this.objectsByMagnitude.reverse();
  }

  // Computes a list of collected objects that will increase the katamari size
  // from `initDiam` to `finalDiam` in the mission `mission`.
  solveDiamDifference = (
    missionData: MissionSizeData,
    initDiam: number,
    finalDiam: number,
  ): ObjectListElement[] => {
    if (finalDiam <= initDiam) return [];

    const result: ObjectListElement[] = [];

    for (let i = 0; i < this.objectsByMagnitude.length; i++) {
      // Immediately rule out objects for which collecting one goes past the expected `finalDiam`.
      const obj = this.objectsByMagnitude[i];
      const sizeAfterOne = addObjectList(missionData, initDiam, [
        { obj, quantity: 1 },
      ]);
      if (sizeAfterOne > finalDiam) continue;

      // If we can add at least one `obj` without going over `finalDiam`, find the largest
      // quantity of added `obj` that doesn't go over `finalDiam`.
      // (Which will be 1 less than the smallest quantity that does go over)
      const nextObjListElt: ObjectListElement = { obj, quantity: 1 };
      result.push(nextObjListElt);
      for (let j = 1; j <= this.MAGNITUDE + 1; j++) {
        nextObjListElt.quantity = j;
        const sizeAfterJ = addObjectList(missionData, initDiam, result);
        if (sizeAfterJ > finalDiam) {
          nextObjListElt.quantity -= 1;
          break;
        }
      }
    }

    return result;
  };
}

const volDiffSolver = new VolumeDifferenceSolver(db);

export const handleAnalogyCommand = (
  query: string,
  game: GAME = GAME.KD,
): string => {
  const LANG: Language = Language.ENGLISH;
  const gameData = GAME_DATA[game];
  // syntax:
  // !analogy [sizelist|?] : [sizelist|?] :: [sizelist|?] : [sizelist|?]
  const queryRegex = /^!analogy\s+(\w+)\s*:\s*([^:]+)\s*:\s*([^:]+)\s*::\s*([^:]+)\s*:\s*([^:]+)\s*$/;

  const match = query.match(queryRegex);
  if (match === null) return analogyCommandErrorStr;

  // trim whitespace off the ends of each capture group
  // in a stupid, lazy way
  const [_, missionStr, lhs0Str, rhs0Str, lhs1Str, rhs1Str] = match.map(s =>
    s.trim(),
  );
  const termStrs = [lhs0Str, rhs0Str, lhs1Str, rhs1Str];

  const mission = parseMission(gameData, missionStr);
  if (mission === undefined) {
    return `Couldn't parse game level: ${missionStr}.`;
  }

  const missionData = gameData[mission];

  const termSizes = termStrs.map(termStr =>
    parseAnalogyTermSize(termStr, LANG),
  );
  const numQuestionMarks = termSizes.filter(t => t === '?').length;
  if (numQuestionMarks !== 1) return analogyCommandErrorStr;

  // Parse the observed initial and final diameter as the lhs/rhs pair without the '?'.
  let initDiam, finalDiam: number;
  let initSolveDiam: number;
  let isAddition: boolean;
  if (termSizes[0] === '?' || termSizes[1] === '?') {
    initDiam = termSizes[2] as number;
    finalDiam = termSizes[3] as number;
    initSolveDiam =
      termSizes[0] === '?'
        ? (termSizes[1] as number)
        : (termSizes[0] as number);
    isAddition = termSizes[1] === '?';
  } else {
    initDiam = termSizes[0] as number;
    finalDiam = termSizes[1] as number;
    initSolveDiam =
      termSizes[2] === '?'
        ? (termSizes[3] as number)
        : (termSizes[2] as number);
    isAddition = termSizes[3] === '?';
  }

  const differenceObjs = volDiffSolver.solveDiamDifference(
    missionData,
    initDiam,
    finalDiam,
  );
  const solvedDiam = isAddition
    ? addObjectList(missionData, initSolveDiam, differenceObjs)
    : subtractObjectList(missionData, initSolveDiam, differenceObjs);

  const solveStr = isAddition
    ? `${printCm(initSolveDiam)} : **${printCm(solvedDiam, 4)}**`
    : `**${printCm(solvedDiam, 4)}** : ${printCm(initSolveDiam)}`;

  return `(**${mission}**) ${printCm(initDiam)} : ${printCm(
    finalDiam,
  )} :: ${solveStr}`;
};

/*example commands
  handleCalcCommand(
    'moon: starfish island - anchor island'
  );

  handleCalcCommand(
    `mas7: garbage - kid's tricycle x9, welcome mat`
  );


*/

console.log(
  handleCalcCommand(
    `!calc mas7: garbage - kid's tricycle x9, welcome mat`,
    GAME.KD,
  ),
);
