import * as yargs from 'yargs';
import { Logger } from './logger';

const args = yargs.option('log', {
  type: 'string',
  alias: 'l',
  description: 'log level (debug/progress/solution)'
}).option('colors', {
  type: 'boolean',
  alias: 'c',
  description: 'enable colors',
  default: false
}).argv;

export const logger = new Logger(args.log || "solution", args.colors);
