import { Logger } from '@nestjs/common';

export type LoggerLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';
const levels: Record<LoggerLevel, number> = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

export class SmartThinsLogger {
  level: string;
  constructor(private readonly loggerLevel: LoggerLevel) {
    this.level = loggerLevel;
  }

  trace(message: unknown, ...args: unknown[]): void {
    Logger.log(message, args);
  }

  debug(message: unknown, ...args: unknown[]): void {
    Logger.log(message, args);
  }

  info(message: unknown, ...args: unknown[]): void {
    Logger.log(message, args);
  }

  warn(message: unknown, ...args: unknown[]): void {
    Logger.warn(message, args.join());
  }

  error(message: unknown, ...args: unknown[]): void {
    Logger.error(message, args.join());
  }

  fatal(message: unknown, ...args: unknown[]): void {
    Logger.error(message, args.join());
  }

  isTraceEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.trace;
  }

  isDebugEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.debug;
  }

  isInfoEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.info;
  }

  isWarnEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.warn;
  }

  isErrorEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.error;
  }

  isFatalEnabled(): boolean {
    return levels[this.loggerLevel] >= levels.fatal;
  }
}
