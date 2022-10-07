export const logArgument = (label = 'argument') => <T>(result: T): T => {
  console.log(`${label}: `, result);
  return result;
};

export const _4piOver3: number = (Math.PI * 4) / 3;
export const _3Over4pi: number = 1 / _4piOver3;
const FUDGE = 0.02;

// volumes are in m^3, diameters are in cm
export const volToDiam = (vol: number): number =>
  Math.pow(vol * _3Over4pi, 0.3333333) * 200 + FUDGE;

export const diamToVol = (diam: number): number =>
  Math.pow((diam - FUDGE) / 200, 3) * _4piOver3;

// the katamari needs to have 30x more volume than an object to
// squash it (i.e. collect it without potentially knocking it airborne).
// this is 3x more volume than you need to collect the object normally.
export const SQUASH_VOL_FACTOR = 30;

// input value `objVol` in m^3, output value in cm.
// note that while the size calc uses the weird fudge factor thing, this formula doesn't.
export const squashDiam = (objVol: number): number => {
  return Math.pow(objVol * _3Over4pi * SQUASH_VOL_FACTOR, 0.3333333) * 200;
};

// prints a size in `cm` in `_m_cm_mm` game format, where the mm place may be
// fractional with `mmPrecision` digits after the decimal.
export const printCm = (cm: number, mmPrecision = 0): string => {
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
