import { groupBy, forEach } from 'lodash';
import { DATA, getCsvData } from './get-data';

interface WlkrDumpRow {
  ctrlIndex: number;
  monoNameIndex: number;
  pickupVolume: number;
  sx: number;
  sy: number;
  sz: number;
  px: number;
  py: number;
  pz: number;
  stage: number;
  submap: number;
  area: number;
  mission: number;
  rule: number;
  subrule: number;
  subLocID: number;
}

interface WlkrObjIndex {
  getMissionObjs(mission: number, rule: number): WlkrDumpRow[];
}

class ObjScale {
  public x: number;
  public y: number;
  public z: number;
  public frequency = 1;

  constructor(row: WlkrDumpRow) {
    this.x = row.sx;
    this.y = row.sy;
    this.z = row.sz;
  }

  incFrequency() {
    this.frequency += 1;
  }

  equals(other: ObjScale): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  toFields() {
    return [this.x, this.y, this.z, this.frequency];
  }
}

class ScaleViolation {
  constructor(
    public mission: string,
    public rule: string,
    public monoNameIndex: string,
    public scale: ObjScale,
  ) {}

  toCsvRow(): string {
    return [
      this.mission,
      this.rule,
      this.monoNameIndex,
      ...this.scale.toFields(),
    ].join(',');
  }
}

class WlkrDump implements WlkrObjIndex {
  private index: { [M: string]: { [R: string]: WlkrDumpRow[] } };

  constructor() {
    const rows = WlkrDump.parseDump();

    // first group by mission
    const missionIndex = groupBy(rows, 'mission');
    // then group by rule
    this.index = {};
    for (const mission in missionIndex) {
      this.index[mission] = groupBy(missionIndex[mission], 'rule');
    }
  }

  getMissionObjs(mission: number, rule: number): WlkrDumpRow[] {
    return this.index[mission][rule];
  }

  auditScales(): string {
    const violations: ScaleViolation[] = [];

    forEach(this.index, (ruleIndex, mission) => {
      forEach(ruleIndex, (rows, rule) => {
        const levelScales: { [K: number]: ObjScale[] } = {};
        rows.forEach(row => {
          const { monoNameIndex } = row;
          const rowScale = new ObjScale(row);
          if (levelScales[monoNameIndex] === undefined) {
            levelScales[monoNameIndex] = [rowScale];
          } else {
            const scaleMatch = levelScales[monoNameIndex].find(scale =>
              scale.equals(rowScale),
            );
            if (scaleMatch !== undefined) {
              scaleMatch.incFrequency();
            } else {
              levelScales[monoNameIndex].push(rowScale);
            }
          }
        });

        forEach(levelScales, (scales, monoNameIndex) => {
          if (scales.length > 1) {
            scales.forEach(scale => {
              violations.push(
                new ScaleViolation(mission, rule, monoNameIndex, scale),
              );
            });
          }
        });
      });
    });

    return violations.map(v => v.toCsvRow()).join('\n');
  }

  static parseDump(): WlkrDumpRow[] {
    const intFields = [
      'ctrlIndex',
      'monoNameIndex',
      'stage',
      'submap',
      'area',
      'mission',
      'rule',
      'subrule',
      'subLocID',
    ];
    const floatFields = ['sx', 'sy', 'sz', 'px', 'py', 'pz', 'pickupVolume'];

    return getCsvData(DATA.WLKR_OBJ_DUMP).map(row => {
      intFields.forEach(field => (row[field] = parseInt(row[field])));
      floatFields.forEach(field => (row[field] = parseFloat(row[field])));
      return row;
    });
  }
}

const dump = new WlkrDump();
console.log(dump.auditScales());
