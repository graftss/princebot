// import { Command } from '../types';
// import { db, KDRObject } from "../../lib/reroll-objects";

// interface IRange {
//   min: number;
//   max: number;
// }

// const sampleRange = ({ min, max }: IRange): number => Math.random() * (max - min) + min;

// interface RollCommandConfig {
//   // The min and max number of seconds an object is active.
//   activeObjectDuration: IRange;
//   // The success chance of rolling an object when the player is larger than it.
//   maxSuccessChance: number;
// }

// const defaultConfig: RollCommandConfig = {
//   activeObjectDuration: { min: 10, max: 15 },
//   maxSuccessChance: 0.75,
// };

// class RollCommandState {
//   activeObject?: KDRObject

//   constructor(
//     private config: RollCommandConfig,
//   ) {}

//   activateObject(object: KDRObject): void {
//     this.activeObject = object;
//   }

//   deactivateObject(): void {
//     this.activeObject = undefined;
//   }

//   attemptRoll(playerSize: number): boolean {
//     if (this.activeObject === undefined) return false;

//     let pickupChance = this.config.maxSuccessChance;

//     // If the active object has a pickup size and it's
//     //
//     if (this.activeObject.pickupSize !== undefined &&
//         playerSize < this.activeObject.pickupSize
//     ) {
//       pickupChance *= 0.5;
//     }

//     return Math.random() < pickupChance;
//   }
// }

// interface RollCommandUserData {
//   username: string;
//   collected: number[]
// }

// // Roll a random object.
// const getRandomObject = (): KDRObject => db.randomCollectibleObject();

// export const handleRoll: Command = (client, message) => {
//   const { channel, text } = message;

// };
