import { HttpException } from '@nestjs/common';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import _ from 'lodash';

import { ResponseErrorProvider } from '../response-error.provider';

class MockAxiosError implements AxiosError {
  toJSON: () => Record<string, unknown>;
  config: AxiosRequestConfig<unknown>;
  code?: undefined;
  request?: undefined;
  response?: undefined;
  isAxiosError: boolean;
  name: string;
  message: string;
  stack?: string | undefined;
}

describe('ResponseErrorProvider', () => {
  it('convertAxiosError', () => {
    const testError = new Error('test');
    try {
      ResponseErrorProvider.convertError(testError);
      expect(false).toBeTruthy();
    } catch (error: unknown) {
      expect(testError).toEqual(error);
    }

    const axiosError = new MockAxiosError();
    axiosError.isAxiosError = true;
    _.set(axiosError, 'response', {
      status: 400,
      data: { message: 'changed Error type' },
    });

    try {
      ResponseErrorProvider.convertError(axiosError);
      expect(false).toBeTruthy();
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        expect(error.getStatus()).toEqual(400);
        expect(error.message).toEqual('changed Error type');
      } else {
        throw new TypeError('fail');
      }
    }
  });
});
