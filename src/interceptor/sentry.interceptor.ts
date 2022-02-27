import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { Severity } from '@sentry/node';
import axios from 'axios';
import _ from 'lodash';
import type { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorMessageProvider } from '../provider/error-message.provider';
import { ResponseErrorProvider } from '../provider/response-error.provider';

interface ISentryEntry {
  body: unknown;
  origin: string;
  action: string;
  headers: unknown;
  propertyId: number;
}

const KNOWN_ERRORS: Array<{
  method: string;
  matchedByUrl: string[];
  message: string;
}> = [];

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, body, url, headers, user } = request;

    const entry: ISentryEntry = {
      action: method,
      origin: url,
      body,
      headers,
      propertyId: user?.propertyDto?.id ?? undefined,
    };

    return next.handle().pipe(
      catchError((err) => {
        const statusCode = err.response?.status || err.status;
        const severity = statusCode < 500 ? Severity.Warning : Severity.Error;
        const message = JSON.stringify(
          err.response?.message ?? err.response?.data?.message,
        );
        if (!this.isKnownIssue(entry.action, entry.origin, message)) {
          Sentry.withScope((scope) => {
            scope.setExtra('status', statusCode);
            scope.setExtra(
              'error',
              err.response?.error ?? err.response?.data?.error,
            );
            scope.setExtra('message', message);
            scope.setExtra('code', err.response?.data?.code);
            scope.setExtra('body', JSON.stringify(entry.body));
            scope.setExtra('headers', JSON.stringify(entry.headers));
            scope.setExtra('origin', entry.origin);
            scope.setExtra('action', entry.action);
            scope.setExtra('propertyId', entry.propertyId);
            scope.setLevel(severity);

            if (axios.isAxiosError(err)) {
              scope.setExtra(
                'axios-error',
                JSON.stringify(ErrorMessageProvider.axiosErrorExtra(err)),
              );
            }

            Sentry.captureException(err);
          });
        }
        ErrorMessageProvider.requestError({
          status: statusCode,
          method: entry.action,
          url: entry.origin,
          headers: entry.headers,
          body: entry.body,
          propertyId: entry.propertyId,
          message: err.message,
        });
        throw ResponseErrorProvider.convertError(err);
      }),
    );
  }

  private isKnownIssue(method: string, url: string, message: string) {
    for (const knownError of KNOWN_ERRORS) {
      if (
        knownError.method !== method ||
        knownError.message !== message ||
        !knownError.matchedByUrl.every((word: string) => url.includes(word))
      ) {
        continue;
      }
      return true;
    }
    return false;
  }
}
