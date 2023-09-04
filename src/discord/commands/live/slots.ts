/*
const retired = [
  '<:cartLady:606338985706651688>',
  '<:pogHam:611584211660439552>',
  '<:SwagBoat:714548717390266478>',
  '<:pogRan:714295923320291361>',
  '<:pauseHam:791441155669491802>',
  '<:littleGhost:609505010572722176>',
  '<:CeilingDad:618193015537664000>',
  '<:yoda:817639930800504832>',
  '<:scuffed:609557151685279805>',
  '<:babyCow:625343020702629889>',
];
*/

export const katamariEmotes = [
  '<:dogLuck:606340486206193714>',
  '<:disTurbing:608464094919393289>',
  '<:KingSpy:741109956840783914>',
  '<:ATM:607693808443850847>',
  '<:penguinLuck:638089244245753856>',
];

export const chestEmotes = [
  '<:lindastare:684550839079141487>',
  '<:NOM:684575930974470426>',
  '<:disturbing:684544945020731415>',
  '<:society:684574419641040905>',
  '<:shynaWOW:761803001567903744>',
  '<:bugREE:761811854267383808>',
  '<:MEGIDO:761805459094241281>',
  '<:HAR:761805483106762772>',
  '<:marina:765071013947506688>',
  '<:tsubohachi:765070770014519307>',
];

const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const slots = (emotes: string[], rolls: number): string => {
  const items: string[] = [];
  for (let i = 0; i < rolls; i++) items.push(sample(emotes));
  return items.join(' ');
};
