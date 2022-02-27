import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { getEnvFilePath, validate } from '../environment.validation';

describe('Config validation failed', () => {
  let validateError: unknown;
  let beforeEnv: string | undefined;

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    beforeEnv = process.env.SENTRY_URL;
    process.env.SENTRY_URL = 'abcd';

    try {
      await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: [getEnvFilePath()],
            validate,
          }),
        ],
      }).compile();
    } catch (error) {
      validateError = error;
    }
  });

  afterAll(() => {
    process.env.SENTRY_URL = beforeEnv;
  });

  it('Validation Failed', () => {
    expect(validateError).toEqual(
      new Error('SENTRY_URL must be an URL address'),
    );
  });
});
