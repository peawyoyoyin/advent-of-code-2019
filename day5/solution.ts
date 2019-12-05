import * as fs from 'fs';
import * as path from 'path';

import { Machine } from './machine';
import { logger } from '../utils/logger';

const inputPath = path.join(__dirname, '../inputs/day5.txt');
const rawInput = fs.readFileSync(inputPath).toString().trim();

const opcodes = rawInput.split(',').map( opcode => parseInt(opcode) );

logger.verbose('opcodes length: ', opcodes.length);
// part 1
logger.progress('=== part 1 ===');
const machine = new Machine(opcodes, [1]);
machine.run();
logger.solution(machine.result());

// part 2
logger.progress('=== part 2 ===');
const machine2 = new Machine(opcodes, [5]);
machine2.run();
logger.solution(machine2.result());
