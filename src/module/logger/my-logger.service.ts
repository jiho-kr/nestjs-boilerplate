import { ConsoleLogger, Injectable } from '@nestjs/common';
import { addBreadcrumb, Severity } from '@sentry/node';
import rTracer from 'cls-rtracer';
import { inspect } from 'util';

@Injectable()
export class MyLogger extends ConsoleLogger {
  constructor() {
    super();
  }

  verbose(message: unknown, context?: string): void {
    const convertedMessage = this.stringify(message);
    super.verbose(convertedMessage, this.appendTraceId(context));
    addBreadcrumb({
      message: convertedMessage,
      level: Severity.Info,
    });
  }

  debug(message: unknown, context?: string): void {
    const convertedMessage = this.stringify(message);
    super.debug(convertedMessage, this.appendTraceId(context));
    addBreadcrumb({
      message: convertedMessage,
      level: Severity.Debug,
    });
  }

  log(message: unknown, context?: string): void {
    const convertedMessage = this.stringify(message);
    super.log(convertedMessage, this.appendTraceId(context));
    addBreadcrumb({
      message: convertedMessage,
      level: Severity.Log,
    });
  }

  warn(message: unknown, context?: string): void {
    const convertedMessage = this.stringify(message);
    super.warn(convertedMessage, this.appendTraceId(context));
    addBreadcrumb({
      message: convertedMessage,
      level: Severity.Warning,
    });
  }

  error(message: unknown, stack?: string, context?: string): void {
    const convertedMessage = this.stringify(message);
    super.error(convertedMessage, stack, this.appendTraceId(context));
    addBreadcrumb({
      message: convertedMessage,
      level: Severity.Error,
    });
  }

  private appendTraceId(context?: string) {
    return [context, rTracer.id()].filter(Boolean).join(' ');
  }

  private stringify(message: unknown): string {
    if (typeof message === 'object') {
      return inspect(message, {
        breakLength: Number.POSITIVE_INFINITY,
      });
    }
    return `${message}`;
  }
}
