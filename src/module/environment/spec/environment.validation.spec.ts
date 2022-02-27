import { ConfigModule, ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { getEnvFilePath, validate } from '../environment.validation';

describe('Environment validation', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    if (process.env.LPORT) {
      delete process.env.LPORT;
    }

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [getEnvFilePath()],
          validate,
        }),
      ],
    }).compile();

    configService = app.get<ConfigService>(ConfigService);
  });

  it('NODE_ENV', () => {
    expect(configService.get<string>('NODE_ENV')).toEqual('development');
  });

  it('return default value, when LPORT is undefined', () => {
    expect(configService.get<number>('LPORT')).toEqual(3000);
  });

  it('IP_WHITE_CIDR is Array Type', () => {
    expect(
      configService.get<string[]>('IP_WHITE_CIDR', []).length,
    ).toBeGreaterThan(0);
  });
});
