import { VolRatesRecord } from ".";

export enum WLK_MISSIONS {
    SUN = 'SUN',
    TUTORIAL = 'TUTORIAL',
    ALAP1 = 'ALAP1',
    ALAP2 = 'ALAP2',
    ALAP3 = 'ALAP3',
    ALAP4 = 'ALAP4',
    ALAP5 = 'ALAP5',
    FLOWERS = 'FLOWERS',
    SCHOOL = 'SCHOOL',
    RACE = 'RACE',
    CLOUDS = 'CLOUDS',
    FRIENDS = 'FRIENDS',
    CRANES = 'CRANES',
    PERFECT = 'PERFECT',
    COWBEAR = 'COWBEAR',
    FIFTY = 'FIFTY',
    CLEANUP = 'CLEANUP',
    DONATIONS = 'DONATIONS',
    SWEETS = 'SWEETS',
    POND = 'POND',
    FIRE = 'FIRE',
    SUMO = 'SUMO',
    SNOW = 'SNOW',
    FIREFLIES = 'FIREFLIES',
    ROSE = 'ROSE',
    COUNTRIES = 'COUNTRIES',
  }
  
  export const WLK_VOLRATES: VolRatesRecord<WLK_MISSIONS> = {
    [WLK_MISSIONS.SUN]: {
      key: WLK_MISSIONS.SUN,
      names: ['sun'],
      multiplierControls: [0, 1.0, 10, 1.0, 100, 0.7, 150, 0.9, 250, 1.0, 270, 0.5, 290, 0.4, 310, 0.3, 320, 0.2, 330, 0.1, 340, 0.1, 350, 0.0, 1000000, 1.0],
    },
    [WLK_MISSIONS.TUTORIAL]: {
      key: WLK_MISSIONS.TUTORIAL,
      names: ['tutorial', 'tut'],
      multiplierControls: [0, 1.0, 10, 1.0, 50, 1.0, 200, 0.9, 300, 0.52, 410, 0.55, 500, 0.42, 800, 0.55, 1000, 0.38, 1010, 0.25, 1200, 0.0],
    },
    [WLK_MISSIONS.ALAP1]: {
      key: WLK_MISSIONS.ALAP1,
      names: ['alap1', 'afap1'],
      multiplierControls: [0, 1.0, 10, 1.0, 100, 0.9, 150, 0.9, 200, 0.9, 500, 0.9, 1000, 0.85, 1500, 1.0, 3000, 0.8, 4000, 0.6, 5000, 0.3, 5500, 0.1, 6000, 0.0],
    },
    [WLK_MISSIONS.ALAP2]: {
      key: WLK_MISSIONS.ALAP2,
      names: ['alap2', 'afap2'],
      multiplierControls: [0, 1.0, 10, 1.0, 1000, 0.8, 1500, 0.7, 1510, 0.75, 2000, 0.55, 3000, 0.55, 5000, 0.3, 5500, 0.1, 6000, 0.0],
    },
    [WLK_MISSIONS.ALAP3]: {
      key: WLK_MISSIONS.ALAP3,
      names: ['alap3', 'afap3'],
      multiplierControls: [0, 1.0, 10, 0.8, 200, 0.8, 300, 0.75, 400, 0.65, 500, 0.6, 510, 0.8, 1000, 0.8, 2000, 0.8, 2500, 0.75, 3000, 0.7, 3010, 0.8, 6000, 0.75, 12000,
  0.7, 20000, 0.6, 28000, 0.5, 30000, 0.1, 30010, 0.01, 30100, 0.0],
    },
    [WLK_MISSIONS.ALAP4]: {
      key: WLK_MISSIONS.ALAP4,
      names: ['alap4', 'afap4'],
      multiplierControls: [0, 1.0, 10, 0.76, 6000, 0.6, 10000, 0.6, 12000, 0.62, 18000, 0.55, 20000, 0.52, 28000, 0.38, 30000, 0.1, 30100, 0.0],
    },
    [WLK_MISSIONS.ALAP5]: {
      key: WLK_MISSIONS.ALAP5,
      names: ['alap5', 'afap5'],
      multiplierControls: [0, 1.0, 1000, 0.8, 3000, 0.78, 3010, 1.0, 8000, 0.8, 12000, 0.4, 12010, 0.8, 20000, 0.8, 25000, 0.8, 26000, 0.8, 30000, 0.7, 35000, 0.7, 40000,
  0.7, 50000, 0.7, 60000, 0.7, 70000, 0.7, 80000, 0.7, 100000, 0.8, 150000, 1.0, 200000, 1.3, 250000, 1.5, 300000, 1.5, 310000, 1.0, 400000, 0.5, 500000, 0.5, 600000, 0.8,
   800000, 0.8, 1100000, 0.8, 1500000, 1.0, 2000000, 1.0, 2500000, 0.8, 2700000, 0.6, 3000000, 0.4, 3500000, 0.2, 4000000, 0.1, 5000000, 1.0],
    },
    [WLK_MISSIONS.FLOWERS]: {
      key: WLK_MISSIONS.FLOWERS,
      names: ['flower', 'flowers'],
      multiplierControls: [0, 1.0, 1000, 0.8, 3000, 0.78, 3010, 1.0, 8000, 0.8, 12000, 0.4, 12010, 0.8, 20000, 0.8, 25000, 0.8, 26000, 0.8, 30000, 0.7, 35000, 0.7, 40000,
  0.7, 50000, 0.7, 60000, 0.7, 70000, 0.7, 80000, 0.7, 100000, 0.8, 150000, 1.0, 200000, 1.3, 250000, 1.5, 300000, 1.5, 310000, 1.0, 400000, 0.5, 500000, 0.5, 600000, 0.5,
   800000, 0.5, 1000000, 0.5, 5000000, 1.0],
    },
    [WLK_MISSIONS.SCHOOL]: {
      key: WLK_MISSIONS.SCHOOL,
      names: ['school'],
      multiplierControls: [0, 1.0, 10, 1.2, 500, 1.2, 1500, 0.9, 2000, 0.8, 3000, 0.6, 4000, 0.4, 1000000, 0.0],
    },
    [WLK_MISSIONS.RACE]: {
      key: WLK_MISSIONS.RACE,
      names: ['race', 'car'],
      multiplierControls: [0, 1.0, 10, 1.1, 500, 1.1, 1500, 1.0, 2000, 0.9, 3000, 0.8, 4000, 0.7, 5000, 0.5, 1000000, 0.0],
    },
    [WLK_MISSIONS.CLOUDS]: {
      key: WLK_MISSIONS.CLOUDS,
      names: ['clouds', 'cloud'],
      multiplierControls: [0, 1.0, 10, 1.2, 500, 1.2, 6000, 1.1, 8000, 1.0, 9000, 0.7, 10000, 0.3, 11000, 0.1, 1000000, 0.0],
    },
    [WLK_MISSIONS.FRIENDS]: {
      key: WLK_MISSIONS.FRIENDS,
      names: ['friends', 'friend'],
      multiplierControls: [0, 1.0, 10, 0.65, 1500, 0.65, 3000, 0.6, 4500, 0.55, 6000, 0.55, 7000, 0.5, 8000, 0.45, 10000, 0.0],
    },
    [WLK_MISSIONS.CRANES]: {
      key: WLK_MISSIONS.CRANES,
      names: ['cranes', 'crane'],
      multiplierControls: [0, 1.0, 10, 1.0, 1000, 0.97, 2000, 0.98, 2300, 0.98, 2500, 0.0],
    },
    [WLK_MISSIONS.PERFECT]: {
      key: WLK_MISSIONS.PERFECT,
      names: ['perfect'],
      multiplierControls: [],
    },
    [WLK_MISSIONS.COWBEAR]: {
      key: WLK_MISSIONS.COWBEAR,
      names: ['cowbear'],
      multiplierControls: [0, 1.0, 10, 0.6, 500, 0.6, 800, 0.6, 1000, 0.5, 1900, 0.4, 2000, 0.0],
    },
    [WLK_MISSIONS.FIFTY]: {
      key: WLK_MISSIONS.FIFTY,
      names: ['fifty', '50'],
      multiplierControls: [0, 1.0, 10, 0.6, 500, 0.6, 800, 0.6, 1000, 0.5, 1900, 0.4, 2000, 0.0],
    },
    [WLK_MISSIONS.CLEANUP]: {
      key: WLK_MISSIONS.CLEANUP,
      names: ['clean', 'cleanup'],
      multiplierControls: [0, 1.0, 10, 0.8, 3000, 0.8, 5000, 0.75, 7000, 0.65, 8100, 0.2, 8200, 0.0],
    },
    [WLK_MISSIONS.DONATIONS]: {
      key: WLK_MISSIONS.DONATIONS,
      names: ['donations', 'donation'],
      multiplierControls: [0, 1.0, 10, 0.7, 1000, 0.7, 1800, 0.6, 1810, 0.2, 1900, 0.0],
    },
    [WLK_MISSIONS.SWEETS]: {
      key: WLK_MISSIONS.SWEETS,
      names: ['sweets', 'sweet', 'candy'],
      multiplierControls: [0, 1.0, 1000, 0.6, 1100, 0.4, 1310, 0.0],
    },
    [WLK_MISSIONS.POND]: {
      key: WLK_MISSIONS.POND,
      names: ['pond', 'water', 'underwater'],
      multiplierControls: [0, 1.0, 1000, 0.3, 1500, 0.0],
    },
    [WLK_MISSIONS.FIRE]: {
      key: WLK_MISSIONS.FIRE,
      names: ['campfire', 'fire'],
      multiplierControls: [0, 1.0, 10, 1.0, 350, 1.0, 400, 0.0],
    },
    [WLK_MISSIONS.SUMO]: {
      key: WLK_MISSIONS.SUMO,
      names: ['sumo'],
      multiplierControls: [0, 1.0, 10, 0.9, 500, 0.9, 1000, 0.8, 2000, 0.6, 3000, 0.4, 4000, 0.0],
    },
    [WLK_MISSIONS.SNOW]: {
      key: WLK_MISSIONS.SNOW,
      names: ['snowman', 'snow'],
      multiplierControls: [0, 1.0, 12000, 0.5, 45000, 0.5, 48000, 0.3, 49000, 0.2, 51000, 0.2, 52000, 0.3, 55000, 0.5, 80000, 1.0, 1000000, 1.0],
    },
    [WLK_MISSIONS.FIREFLIES]: {
      key: WLK_MISSIONS.FIREFLIES,
      names: ['firefly', 'fireflies'],
      multiplierControls: [0, 1.0, 10, 0.9, 200, 0.9, 600, 0.85, 1000, 0.7, 1200, 0.5, 2000, 0.35, 2010, 0.3, 2050, 0.2, 2080, 0.02, 2100, 0.0],
    },
    [WLK_MISSIONS.ROSE]: {
      key: WLK_MISSIONS.ROSE,
      names: ['rose', 'roses'],
      multiplierControls: [0, 1.0, 10, 0.85, 200, 0.85, 300, 0.65, 400, 0.55, 500, 0.85, 600, 0.84, 1000, 0.7, 1200, 0.5, 2000, 0.2, 2050, 0.1, 2100, 0.0],
    },
    [WLK_MISSIONS.COUNTRIES]: {
      key: WLK_MISSIONS.COUNTRIES,
      names: ['countries'],
      multiplierControls: [0, 1.0, 10, 1.0, 1000000, 1.0],
    },
  };
  