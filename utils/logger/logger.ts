import * as chalk from 'chalk';

enum LogLevel {
  vverbose = 5,
  verbose = 4,
  debug = 3,
  progress = 2,
  solution = 1
}

function logColor(logLevel: LogLevel): chalk.Chalk {
  switch(logLevel) {
    case LogLevel.vverbose:
      return chalk.magenta;
    case LogLevel.verbose:
      return chalk.blue;
    case LogLevel.debug:
      return chalk.red;
    case LogLevel.progress:
      return chalk.yellow;
    case LogLevel.solution:
      return chalk.green;
  }
}

class Logger {
  private logLevel: LogLevel;
  constructor(rawLogLevel: string, private colors: boolean) {
    this.logLevel = (<any>LogLevel)[rawLogLevel] || LogLevel.solution;
    console.log('loglevel', this.logLevel);
  }

  private logIfLevel(logLevel: LogLevel): (...args: any[]) => void {
    let prefix = `[${LogLevel[logLevel]}]:`;
    if (this.colors) {
      prefix = logColor(logLevel)(prefix);
    }

    return (...args: any) => {
      if(logLevel <= this.logLevel) {
        console.log(prefix, ...args);
      }
    }
  }

  public debug = this.logIfLevel(LogLevel.debug);
  public progress = this.logIfLevel(LogLevel.progress);
  public solution = this.logIfLevel(LogLevel.solution);
  public verbose = this.logIfLevel(LogLevel.verbose);
  public vverbose = this.logIfLevel(LogLevel.vverbose);
}

export { Logger };
