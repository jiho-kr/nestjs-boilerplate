import type { UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { Severity } from '@sentry/node';
import type { AxiosError } from 'axios';
import type { Request } from 'express';
import _ from 'lodash';

interface IAxiosErrorExtra {
  message: string;
  status: number;
  statusText: string;
  method: string;
  url: string;
  params: string;
  body: string;
  headers: string;
}

export class ErrorMessageProvider {
  static httpError(axiosError: AxiosError, name: string): void {
    const extra = this.axiosErrorExtra(axiosError);

    const messages = [
      extra.message,
      `- url : ${extra.status}(${extra.statusText}) [${extra.method}] ${extra.url}`,
      `- params: ${JSON.stringify(extra.params)}`,
      `- body: ${JSON.stringify(extra.body)}`,
      `- headers: ${JSON.stringify(extra.headers)}`,
    ];
    Logger.warn(messages.join('\n'), name);
  }

  static axiosErrorExtra(axiosError: AxiosError): IAxiosErrorExtra {
    const { response } = axiosError;
    const status = response.status;
    const statusText = response.statusText;
    const method = response.config?.method;

    return {
      message: _.get(axiosError, 'message', ''),
      status,
      statusText,
      method,
      url: _.get(response, 'request.res.responseUrl'),
      params: _.get(response, 'config.params', ''),
      body: _.get(response, 'config.data', ''),
      headers: _.get(response, 'config.headers', ''),
    };
  }

  static requestError(params: {
    status: number;
    method: string;
    url: string;
    headers: unknown;
    body: unknown;
    propertyId: number;
    message: string;
  }): void {
    const messages = [
      params.message,
      `- url: ${params.status} [${params.method}] ${params.url}`,
      `- propertyId: ${params.propertyId}`,
      `- headers: ${JSON.stringify(params.headers)}`,
      `- body: ${JSON.stringify(params.body)}`,
    ];
    Logger.warn(messages.join('\n'));
  }

  static unauthorizedException(
    request: Request,
    error: UnauthorizedException,
    option?: Record<string, unknown>,
  ): void {
    const messages = [
      error.message,
      `- method: ${request.method}`,
      `- url: ${request.url}`,
      `- params: ${JSON.stringify(request.params)}`,
      `- query: ${JSON.stringify(request.query)}`,
      `- headers: ${JSON.stringify(request.headers)}`,
      `- body: ${JSON.stringify(request.body)}`,
      `- option: ${JSON.stringify(option)}`,
    ];
    Logger.warn(messages.join('\n'), error.name);
    Sentry.withScope((scope) => {
      scope.setExtra('status', error.getStatus());
      scope.setExtra('error', error.name);
      scope.setExtra('message', error.message);
      scope.setExtra('body', JSON.stringify(request.body));
      scope.setExtra('headers', JSON.stringify(request.headers));
      scope.setExtra('origin', request.url);
      scope.setExtra('action', request.method);
      scope.setExtra('option', option);
      scope.setLevel(Severity.Warning);

      Sentry.captureException(error);
    });
    throw error;
  }

  static awsAppsyncException(
    error: unknown,
    option?: Record<string, unknown>,
  ): void {
    Logger.warn(error, 'AWS AppSync Exception');
    Sentry.withScope((scope) => {
      scope.setExtra('service', 'Aws AppSync');
      if (typeof error === 'object') {
        for (const key of [
          'graphQLErrors',
          'networkError',
          'message',
          'name',
        ]) {
          if (key in error) {
            scope.setExtra(key, JSON.stringify(_.get(error, key)));
          }
        }
      }
      scope.setExtra('option', option);
      scope.setLevel(Severity.Warning);

      Sentry.captureException(error);
    });
  }
}
