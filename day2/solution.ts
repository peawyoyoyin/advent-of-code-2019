import * as fs from 'fs';
import * as path from 'path';

import { Machine } from './machine';
import { logger } from '../utils/logger';

const inputPath = path.join(__dirname, '../inputs/day2.txt');
const rawInput = fs.readFileSync(inputPath).toString().trim();

const opcodes = rawInput.split(',').map( opcode => parseInt(opcode) );

// part 1
const machine = new Machine(opcodes);
machine.run();
logger.solution(machine.result());

// part 2
let found = false;
const target = 19690720;
for (let i=0; i<100; i++) {
  for (let j=0; j<100; j++) {
    machine.setup(i, j);
    logger.progress('trying noun', i, 'verb', j);
    machine.run();
    if (machine.result() == target) {
      found = true;
      logger.solution('SOLUTION FOUND!');
      logger.solution(`noun=${i}, verb=${j}`);
      logger.solution(`solution = ${100*i + j}`)
      break;
    } else {
      logger.debug(`result for ${i} ${j} is ${machine.result()}`)
    }
  }
  if (found) {
    break;
  }
}
