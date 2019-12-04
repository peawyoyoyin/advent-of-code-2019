import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../utils/logger';

function fuelRequired(mass: number): number {
  return Math.floor(mass / 3) - 2;
}

function fuelRequiredRecursively(mass: number): number {
  if(!mass) {
    return 0;
  }
  let massRequired = Math.floor(mass / 3) - 2;

  if (massRequired <= 0) {
    return 0;
  }
  return massRequired + fuelRequiredRecursively(massRequired);
}


// input
const inputPath = path.join(__dirname, '../inputs/day1.txt');
const rawInput = fs.readFileSync(inputPath).toString().trim();
const masses = rawInput.split('\n').map( rawMass => parseInt(rawMass) );

let sum_part1 = 0;
let sum_part2 = 0;
for (let mass of masses) {
  logger.progress('calculating mass:', mass);
  sum_part1 += fuelRequired(mass);
  sum_part2 += fuelRequiredRecursively(mass);
}

logger.solution('part 1 solution:', sum_part1);
logger.solution('part 2 solution:', sum_part2);
