import * as chalk from 'chalk';

enum LogLevel {
  debug = 0,
  progress = 1,
  solution = 2
}

function logColor(logLevel: LogLevel): chalk.Chalk {
  switch(logLevel) {
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
  }

  private logIfLevel(logLevel: LogLevel): (...args: any[]) => void {
    let prefix = `[${LogLevel[logLevel]}]:`;
    if (this.colors) {
      prefix = logColor(logLevel)(prefix);
    }

    return (...args: any) => {
      if(logLevel >= this.logLevel) {
        console.log(prefix, ...args);
      }
    }
  }

  public debug = this.logIfLevel(LogLevel.debug);
  public progress = this.logIfLevel(LogLevel.progress);
  public solution = this.logIfLevel(LogLevel.solution);
}

export { Logger };
