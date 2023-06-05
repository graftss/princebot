import { VolRatesRecord } from '.';

export enum WLK_MISSIONS {
  big1_1 = 'big1_1',
  big1_2 = 'big1_2',
  big2_1 = 'big2_1',
  big2_2 = 'big2_2',
  big3_1 = 'big3_1',
  big3_2 = 'big3_2',
  big4_1 = 'big4_1',
  big4_2 = 'big4_2',
  big5_1 = 'big5_1',
  big5_2 = 'big5_2',
  camp_1 = 'camp_1',
  camp_2 = 'camp_2',
  camp_3 = 'camp_3',
  cow_1 = 'cow_1',
  earth_1 = 'earth_1',
  ending_1 = 'ending_1',
  flower_1 = 'flower_1',
  flower_2 = 'flower_2',
  get_limit_1 = 'get_limit_1',
  hotaru_1 = 'hotaru_1',
  itoko_1 = 'itoko_1',
  itoko_2 = 'itoko_2',
  just_size_1 = 'just_size_1',
  just_size_2 = 'just_size_2',
  just_size_3 = 'just_size_3',
  lake_1 = 'lake_1',
  lake_2 = 'lake_2',
  origami_1 = 'origami_1',
  ousama_1 = 'ousama_1',
  ousama_2 = 'ousama_2',
  ousama_3 = 'ousama_3',
  ousama_4 = 'ousama_4',
  race_1 = 'race_1',
  race_2 = 'race_2',
  room_1 = 'room_1',
  rose_1 = 'rose_1',
  rose_2 = 'rose_2',
  rose_3 = 'rose_3',
  school_1 = 'school_1',
  school_2 = 'school_2',
  school_3 = 'school_3',
  shopping_1 = 'shopping_1',
  sky_1 = 'sky_1',
  sky_2 = 'sky_2',
  snow_1 = 'snow_1',
  snow_c = 'snow_c',
  space_1 = 'space_1',
  sumo_1 = 'sumo_1',
  sumo_2 = 'sumo_2',
  sumo_3 = 'sumo_3',
  sweet_1 = 'sweet_1',
  sweet_2 = 'sweet_2',
  sweet_3 = 'sweet_3',
  sweet_4 = 'sweet_4',
  test_1 = 'test_1',
  tutorial_1 = 'tutorial_1',
  vs_1 = 'vs_1',
  vs_2 = 'vs_2',
  vs_3 = 'vs_3',
  zoo_1 = 'zoo_1',
  zoo_2 = 'zoo_2',
  load = 'load',
  dlc_study_1 = 'dlc_study_1',
  dlc_swan_1 = 'dlc_swan_1',
  dlc_tire_1 = 'dlc_tire_1',
  dlc_training_1 = 'dlc_training_1',
  dlc_piano_1 = 'dlc_piano_1',
}

interface WLKMissionData {
  internalName: WLK_MISSIONS;
  displayName?: string;
  aliases: string[];
  initSize: number;
  volRates?: number[];
}

const WLK_MISSION_NAMES: WLKMissionData[] = [
  {
    internalName: WLK_MISSIONS.big1_1,
    displayName: 'ALAP1',
    aliases: [],
    initSize: 50,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      250,
      1.0,
      270,
      0.5,
      290,
      0.4,
      310,
      0.3,
      320,
      0.3,
      330,
      0.3,
      350,
      0.3,
      360,
      0.1,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big1_2,
    displayName: 'AFAP1',
    aliases: [],
    initSize: 50,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      100,
      0.7,
      150,
      0.9,
      250,
      1.0,
      270,
      0.5,
      290,
      0.4,
      310,
      0.3,
      320,
      0.2,
      330,
      0.1,
      340,
      0.1,
      350,
      0.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big2_1,
    displayName: 'ALAP2',
    aliases: [],
    initSize: 50,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      50,
      1.0,
      200,
      1.0,
      210,
      0.9,
      500,
      0.8,
      800,
      0.6,
      1000,
      0.35,
      1010,
      0.3,
      1200,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big2_2,
    displayName: 'AFAP2',
    aliases: [],
    initSize: 300,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      50,
      1.0,
      200,
      0.9,
      300,
      0.52,
      410,
      0.55,
      500,
      0.42,
      800,
      0.55,
      1000,
      0.38,
      1010,
      0.25,
      1200,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big3_1,
    displayName: 'ALAP3',
    aliases: [],
    initSize: 100,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      100,
      0.9,
      150,
      0.9,
      200,
      0.9,
      500,
      0.9,
      1000,
      0.85,
      1500,
      1.0,
      3000,
      0.8,
      4000,
      0.6,
      5000,
      0.3,
      5500,
      0.1,
      6000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big3_2,
    displayName: 'AFAP3',
    aliases: [],
    initSize: 1500,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1000,
      0.8,
      1500,
      0.7,
      1510,
      0.75,
      2000,
      0.55,
      3000,
      0.55,
      5000,
      0.3,
      5500,
      0.1,
      6000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big4_1,
    displayName: 'ALAP4',
    aliases: [],
    initSize: 200,
    volRates: [
      0,
      1.0,
      10,
      0.8,
      200,
      0.8,
      300,
      0.75,
      400,
      0.65,
      500,
      0.6,
      510,
      0.8,
      1000,
      0.8,
      2000,
      0.8,
      2500,
      0.75,
      3000,
      0.7,
      3010,
      0.8,
      6000,
      0.75,
      12000,
      0.7,
      20000,
      0.6,
      28000,
      0.5,
      30000,
      0.1,
      30010,
      0.01,
      30100,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big4_2,
    displayName: 'AFAP4',
    aliases: [],
    initSize: 10000,
    volRates: [
      0,
      1.0,
      10,
      0.76,
      6000,
      0.6,
      10000,
      0.6,
      12000,
      0.62,
      18000,
      0.55,
      20000,
      0.52,
      28000,
      0.38,
      30000,
      0.1,
      30100,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big5_1,
    displayName: 'ALAP5',
    aliases: [],
    initSize: 1000,
    volRates: [
      0,
      1.0,
      1000,
      0.8,
      3000,
      0.78,
      3010,
      1.0,
      8000,
      0.8,
      12000,
      0.4,
      12010,
      0.8,
      20000,
      0.8,
      25000,
      0.8,
      26000,
      0.8,
      30000,
      0.7,
      35000,
      0.7,
      40000,
      0.7,
      50000,
      0.7,
      60000,
      0.7,
      70000,
      0.7,
      80000,
      0.7,
      100000,
      0.8,
      150000,
      1.0,
      200000,
      1.3,
      250000,
      1.5,
      300000,
      1.5,
      310000,
      1.0,
      400000,
      0.5,
      500000,
      0.5,
      600000,
      0.8,
      800000,
      0.8,
      1100000,
      0.8,
      1500000,
      1.0,
      2000000,
      1.0,
      2500000,
      0.8,
      2700000,
      0.6,
      3000000,
      0.4,
      3500000,
      0.2,
      4000000,
      0.1,
      5000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.big5_2,
    displayName: 'AFAP5',
    aliases: [],
    initSize: 2000,
    volRates: [
      0,
      1.0,
      1000,
      0.8,
      3000,
      0.78,
      3010,
      1.0,
      8000,
      0.8,
      12000,
      0.4,
      12010,
      0.8,
      20000,
      0.8,
      25000,
      0.8,
      26000,
      0.8,
      30000,
      0.7,
      35000,
      0.7,
      40000,
      0.7,
      50000,
      0.7,
      60000,
      0.7,
      70000,
      0.7,
      80000,
      0.7,
      100000,
      0.8,
      150000,
      1.0,
      200000,
      1.3,
      250000,
      1.5,
      300000,
      1.5,
      310000,
      1.0,
      400000,
      0.5,
      500000,
      0.5,
      600000,
      0.5,
      800000,
      0.5,
      1000000,
      0.5,
      5000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.camp_1,
    displayName: 'Small Fire',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      1.2,
      500,
      1.2,
      1500,
      0.9,
      2000,
      0.8,
      3000,
      0.6,
      4000,
      0.4,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.camp_2,
    displayName: 'Middle Fire',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      1.1,
      500,
      1.1,
      1500,
      1.0,
      2000,
      0.9,
      3000,
      0.8,
      4000,
      0.7,
      5000,
      0.5,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.camp_3,
    displayName: 'Big Fire',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      1.2,
      500,
      1.2,
      6000,
      1.1,
      8000,
      1.0,
      9000,
      0.7,
      10000,
      0.3,
      11000,
      0.1,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.cow_1,
    displayName: 'Cowbear',
    aliases: [],
    initSize: 1500,
    volRates: [
      0,
      1.0,
      10,
      0.65,
      1500,
      0.65,
      3000,
      0.6,
      4500,
      0.55,
      6000,
      0.55,
      7000,
      0.5,
      8000,
      0.45,
      10000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.earth_1,
    displayName: 'Countries',
    aliases: [],
    initSize: 1000,
    volRates: [0, 1.0, 10, 1.0, 1000, 0.97, 2000, 0.98, 2300, 0.98, 2500, 0.0],
  },
  {
    internalName: WLK_MISSIONS.ending_1,
    displayName: 'Ending',
    aliases: [],
    initSize: 500,
    volRates: undefined,
  },
  {
    internalName: WLK_MISSIONS.flower_1,
    displayName: 'ALAP (Flowers)',
    aliases: [],
    initSize: 870,
    volRates: [
      0,
      1.0,
      10,
      0.6,
      500,
      0.6,
      800,
      0.6,
      1000,
      0.5,
      1900,
      0.4,
      2000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.flower_2,
    displayName: 'AFAP (Flowers)',
    aliases: [],
    initSize: 870,
    volRates: [
      0,
      1.0,
      10,
      0.6,
      500,
      0.6,
      800,
      0.6,
      1000,
      0.5,
      1900,
      0.4,
      2000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.get_limit_1,
    displayName: 'Only Fifty',
    aliases: [],
    initSize: 3000,
    volRates: [
      0,
      1.0,
      10,
      0.8,
      3000,
      0.8,
      5000,
      0.75,
      7000,
      0.65,
      8100,
      0.2,
      8200,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.hotaru_1,
    displayName: 'Fireflies',
    aliases: [],
    initSize: 1000,
    volRates: [0, 1.0, 10, 0.7, 1000, 0.7, 1800, 0.6, 1810, 0.2, 1900, 0.0],
  },
  {
    internalName: WLK_MISSIONS.itoko_1,
    displayName: 'itoko_1',
    aliases: [],
    initSize: 1000,
    volRates: [0, 1.0, 1000, 0.6, 1100, 0.4, 1310, 0.0],
  },
  {
    internalName: WLK_MISSIONS.itoko_2,
    displayName: 'itoko_2',
    aliases: [],
    initSize: 1000,
    volRates: [0, 1.0, 1000, 0.3, 1500, 0.0],
  },
  {
    internalName: WLK_MISSIONS.just_size_1,
    displayName: 'Small Perfect',
    aliases: [],
    initSize: 50,
    volRates: [0, 1.0, 10, 1.0, 350, 1.0, 400, 0.0],
  },
  {
    internalName: WLK_MISSIONS.just_size_2,
    displayName: 'Middle Perfect',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      0.9,
      500,
      0.9,
      1000,
      0.8,
      2000,
      0.6,
      3000,
      0.4,
      4000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.just_size_3,
    displayName: 'Big Perfect',
    aliases: [],
    initSize: 23000,
    volRates: [
      0,
      1.0,
      12000,
      0.5,
      45000,
      0.5,
      48000,
      0.3,
      49000,
      0.2,
      51000,
      0.2,
      52000,
      0.3,
      55000,
      0.5,
      80000,
      1.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.lake_1,
    displayName: 'ALAP (Pond)',
    aliases: [],
    initSize: 200,
    volRates: [
      0,
      1.0,
      10,
      0.9,
      200,
      0.9,
      600,
      0.85,
      1000,
      0.7,
      1200,
      0.5,
      2000,
      0.35,
      2010,
      0.3,
      2050,
      0.2,
      2080,
      0.02,
      2100,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.lake_2,
    displayName: 'AFAP (Pond)',
    aliases: [],
    initSize: 300,
    volRates: [
      0,
      1.0,
      10,
      0.85,
      200,
      0.85,
      300,
      0.65,
      400,
      0.55,
      500,
      0.85,
      600,
      0.84,
      1000,
      0.7,
      1200,
      0.5,
      2000,
      0.2,
      2050,
      0.1,
      2100,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.origami_1,
    displayName: 'A Thousand Cranes',
    aliases: [],
    initSize: 200,
    volRates: [
      0,
      1.0,
      10,
      0.6,
      200,
      0.6,
      400,
      0.55,
      600,
      0.5,
      800,
      0.4,
      900,
      0.1,
      1000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.ousama_1,
    displayName: 'ousama_1',
    aliases: [],
    initSize: 500,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.ousama_2,
    displayName: 'ousama_2',
    aliases: [],
    initSize: 500,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.ousama_3,
    displayName: 'ousama_3',
    aliases: [],
    initSize: 500,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.ousama_4,
    displayName: 'ousama_4',
    aliases: [],
    initSize: 500,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.race_1,
    displayName: 'ALAP (Race)',
    aliases: [],
    initSize: 1200,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1000,
      1.0,
      1300,
      1.0,
      1500,
      0.8,
      2500,
      0.6,
      3000,
      1.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.race_2,
    displayName: 'AFAP (Race)',
    aliases: [],
    initSize: 2000,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1000,
      1.0,
      1300,
      1.0,
      1500,
      0.8,
      2000,
      0.6,
      2500,
      1.0,
      3000,
      1.0,
      5000,
      1.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.room_1,
    displayName: 'Clean Up',
    aliases: [],
    initSize: 80,
    volRates: [
      0,
      1.0,
      10,
      1.5,
      80,
      1.5,
      170,
      1.5,
      190,
      1.0,
      200,
      0.5,
      220,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.rose_1,
    displayName: 'rose_1',
    aliases: [],
    initSize: 800,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.rose_2,
    displayName: 'rose_2',
    aliases: [],
    initSize: 800,
    volRates: [0, 1.0, 10, 0.5, 800, 0.5, 900, 0.05, 100000, 0.0],
  },
  {
    internalName: WLK_MISSIONS.rose_3,
    displayName: 'rose_3',
    aliases: [],
    initSize: 800,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.school_1,
    displayName: 'school_1',
    aliases: [],
    initSize: 250,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      500,
      1.0,
      600,
      0.7,
      700,
      1.0,
      1200,
      1.0,
      1500,
      0.7,
      2000,
      0.7,
      2400,
      0.6,
      2500,
      0.4,
      2900,
      0.4,
      3000,
      0.4,
      3500,
      0.4,
      3800,
      0.5,
      4100,
      0.5,
      4200,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.school_2,
    displayName: 'school_2',
    aliases: [],
    initSize: 1300,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1300,
      0.65,
      1600,
      0.6,
      2000,
      0.55,
      2300,
      0.4,
      3000,
      0.1,
      3700,
      0.01,
      4000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.school_3,
    displayName: 'school_3',
    aliases: [],
    initSize: 400,
    volRates: [
      0,
      1.0,
      300,
      1.1,
      500,
      1.1,
      600,
      1.1,
      1000,
      1.2,
      1100,
      1.4,
      1200,
      1.3,
      1300,
      1.2,
      1500,
      1.0,
      2000,
      0.8,
      2500,
      0.6,
      3000,
      0.5,
      3500,
      0.4,
      3700,
      0.2,
      4000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.shopping_1,
    displayName: 'shopping_1',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      500,
      1.0,
      1500,
      0.9,
      2000,
      0.8,
      2500,
      0.7,
      3000,
      0.6,
      3500,
      0.5,
      4000,
      0.0,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sky_1,
    displayName: 'Clouds',
    aliases: [],
    initSize: 100000,
    volRates: [
      0,
      1.0,
      1000,
      1.0,
      99000,
      0.4,
      130000,
      0.3,
      400000,
      0.25,
      700000,
      0.25,
      820000,
      0.2,
      900000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sky_2,
    displayName: 'sky_2',
    aliases: [],
    initSize: 100000,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.snow_1,
    displayName: 'Snow',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      0.5,
      1300,
      0.5,
      3000,
      0.6,
      5000,
      0.7,
      7000,
      0.8,
      9000,
      0.4,
      10000,
      0.0,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.snow_c,
    displayName: 'snow_c',
    aliases: [],
    initSize: 500,
    volRates: undefined,
  },
  {
    internalName: WLK_MISSIONS.space_1,
    displayName: 'Sun',
    aliases: [],
    initSize: 1000,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1000,
      1.0,
      1400,
      0.8,
      1600,
      0.6,
      1800,
      0.6,
      2000,
      0.7,
      2100,
      0.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sumo_1,
    displayName: 'sumo_1',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      500,
      0.3,
      900,
      0.4,
      1000,
      1.0,
      1300,
      1.0,
      1310,
      0.3,
      1560,
      0.3,
      1580,
      1.0,
      2000,
      1.0,
      3000,
      1.0,
      4000,
      1.5,
      5000,
      1.5,
      5500,
      1.0,
      6000,
      0.1,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sumo_2,
    displayName: 'sumo_2',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      500,
      0.3,
      900,
      0.4,
      1000,
      1.0,
      2000,
      1.0,
      2010,
      0.5,
      2410,
      0.5,
      2450,
      1.0,
      3000,
      1.0,
      4000,
      1.5,
      5000,
      1.5,
      5500,
      1.0,
      6000,
      0.1,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sumo_3,
    displayName: 'sumo_3',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      500,
      0.3,
      900,
      0.4,
      1000,
      1.0,
      2000,
      1.0,
      3000,
      1.0,
      3500,
      1.0,
      4000,
      1.2,
      5000,
      1.5,
      5500,
      1.0,
      5950,
      0.1,
      6000,
      0.0,
      1000000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sweet_1,
    displayName: 'sweet_1',
    aliases: [],
    initSize: 500,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      500,
      1.0,
      800,
      0.7,
      1000,
      0.5,
      1600,
      0.5,
      2000,
      0.5,
      2500,
      0.4,
      3000,
      0.4,
      3500,
      0.3,
      4000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sweet_2,
    displayName: 'sweet_2',
    aliases: [],
    initSize: 700,
    volRates: [
      0,
      1.0,
      10,
      0.13,
      800,
      0.13,
      1000,
      0.13,
      2000,
      0.13,
      2500,
      0.1,
      3000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sweet_3,
    displayName: 'sweet_3',
    aliases: [],
    initSize: 700,
    volRates: [
      0,
      1.0,
      10,
      0.13,
      800,
      0.13,
      1000,
      0.13,
      2000,
      0.13,
      2500,
      0.1,
      3000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.sweet_4,
    displayName: 'sweet_4',
    aliases: [],
    initSize: 700,
    volRates: [
      0,
      1.0,
      10,
      0.13,
      800,
      0.13,
      1000,
      0.13,
      2000,
      0.13,
      2500,
      0.1,
      3000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.test_1,
    displayName: 'test_1',
    aliases: [],
    initSize: 700,
    volRates: [0, 1.0, 10, 1.0, 1000000, 1.0],
  },
  {
    internalName: WLK_MISSIONS.tutorial_1,
    displayName: 'tutorial_1',
    aliases: [],
    initSize: 50,
    volRates: [
      0,
      1.0,
      10,
      0.9,
      80,
      0.9,
      90,
      0.5,
      120,
      0.5,
      140,
      0.3,
      150,
      0.3,
      160,
      0.5,
      200,
      0.8,
      300,
      0.8,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.vs_1,
    displayName: 'vs_1',
    aliases: [],
    initSize: 60,
    volRates: [0, 1.0, 10, 1.0, 180, 1.0, 200, 0.0, 1000000, 0.0],
  },
  {
    internalName: WLK_MISSIONS.vs_2,
    displayName: 'vs_2',
    aliases: [],
    initSize: 1500,
    volRates: [0, 1.0, 10, 1.0, 3000, 1.0, 5000, 0.0, 1000000, 0.0],
  },
  {
    internalName: WLK_MISSIONS.vs_3,
    displayName: 'vs_3',
    aliases: [],
    initSize: 30000,
    volRates: [0, 1.0, 10, 1.0, 50000, 1.0, 80000, 0.0, 100000, 0.0],
  },
  {
    internalName: WLK_MISSIONS.zoo_1,
    displayName: 'zoo_1',
    aliases: [],
    initSize: 800,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      800,
      0.8,
      1000,
      0.8,
      1500,
      0.8,
      2500,
      0.8,
      3000,
      0.8,
      5000,
      0.8,
      8000,
      0.8,
      9000,
      0.8,
      10000,
      0.7,
      10010,
      0.1,
      15000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.zoo_2,
    displayName: 'zoo_2',
    aliases: [],
    initSize: 1500,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1500,
      0.8,
      2000,
      0.8,
      2500,
      0.8,
      3000,
      0.8,
      3500,
      0.8,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.load,
    displayName: 'load',
    aliases: [],
    initSize: 1000,
    volRates: undefined,
  },
  {
    internalName: WLK_MISSIONS.dlc_study_1,
    displayName: 'dlc_study_1',
    aliases: [],
    initSize: 80,
    volRates: [
      0,
      1.0,
      10,
      1.5,
      80,
      1.5,
      170,
      1.5,
      190,
      1.0,
      200,
      0.5,
      220,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.dlc_swan_1,
    displayName: 'dlc_swan_1',
    aliases: [],
    initSize: 800,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      800,
      0.8,
      1000,
      0.8,
      1500,
      0.8,
      2500,
      0.8,
      3000,
      0.8,
      5000,
      0.8,
      8000,
      0.8,
      9000,
      0.8,
      10000,
      0.7,
      10010,
      0.1,
      15000,
      0.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.dlc_tire_1,
    displayName: 'dlc_tire_1',
    aliases: [],
    initSize: 1200,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      1000,
      1.0,
      1300,
      1.0,
      1500,
      0.8,
      2500,
      0.6,
      3000,
      1.0,
      1000000,
      1.0,
    ],
  },
  {
    internalName: WLK_MISSIONS.dlc_training_1,
    displayName: 'dlc_training_1',
    aliases: [],
    initSize: 1000,
    volRates: [0, 1.0, 10, 0.7, 1000, 0.7, 1800, 0.6, 1810, 0.2, 1900, 0.0],
  },
  {
    internalName: WLK_MISSIONS.dlc_piano_1,
    displayName: 'dlc_piano_1',
    aliases: [],
    initSize: 300,
    volRates: [
      0,
      1.0,
      10,
      1.0,
      500,
      1.0,
      600,
      0.7,
      700,
      1.0,
      1200,
      1.0,
      1500,
      0.7,
      2000,
      0.7,
      2400,
      0.6,
      2500,
      0.4,
      2900,
      0.4,
      3000,
      0.4,
      3500,
      0.4,
      3800,
      0.5,
      4100,
      0.5,
      4200,
      0.0,
    ],
  },
];

// translate the above generated code into the old `VolRatesRecord` structure because lazy
export const WLK_VOLRATES: VolRatesRecord<WLK_MISSIONS> = WLK_MISSION_NAMES.reduce(
  (result: any, data) => {
    result[data.internalName] = {
      key: data.internalName,
      names: [data.displayName?.toLowerCase(), ...data.aliases],
      initDiam: data.initSize,
      multiplierControls: data.volRates?.map((x, idx) =>
        idx % 2 == 0 ? x / 10 : x,
      ),
    };
    return result;
  },
  {},
);

console.log(WLK_VOLRATES);
