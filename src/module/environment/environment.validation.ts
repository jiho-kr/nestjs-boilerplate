import { Logger } from '@nestjs/common';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import _ from 'lodash';
import path from 'path';

import { LogType } from '../../constant/log-types';

function Description(_description: string): PropertyDecorator {
  return function (_target, _name) {};
}

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Stage = 'stage',
  Qa = 'qa',
  Local = 'local',
}

enum MorganFormats {
  Combined = 'combined',
  Common = 'common',
  Dev = 'dev',
  Short = 'short',
  Tiny = 'tiny',
}

class EnvironmentVariables {
  @Description('Mode')
  @Expose({ name: 'NODE_ENV' })
  @Transform(({ value }) => value ?? NodeEnvironment.Development)
  @IsEnum(NodeEnvironment)
  @IsNotEmpty()
  ENV: NodeEnvironment;

  @Description('Express Log Format')
  @Expose({ name: 'HTTP_LOG_FORMAT' })
  @Transform(({ value }) => value ?? MorganFormats.Tiny)
  @IsEnum(MorganFormats)
  @IsNotEmpty()
  HTTP_LOG_FORMAT: MorganFormats;

  @Description('USE SENTRY')
  @IsBoolean()
  @Transform(({ value }) => value !== 'false')
  @Expose({ name: 'USE_SENTRY' })
  USE_SENTRY: boolean;

  @Description('Sentry URL')
  @IsUrl()
  @IsNotEmpty()
  SENTRY_URL: string;

  @Description('Server Listen Port')
  @Expose({ name: 'LPORT' })
  @Transform(({ value }) => value ?? 3000)
  @Type(() => Number)
  @IsNumber()
  LPORT: number;

  @Description('API Version')
  @IsLowercase()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? 'v2')
  @Expose({ name: 'API_VERSION' })
  API_VERSION: string;

  @Description('Express Body Size Limit')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? '1mb')
  @Expose({ name: 'HTTP_BODY_SIZE_LIMIT' })
  HTTP_BODY_SIZE_LIMIT: string;

  @Description('Express URL Limit')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? '1mb')
  @Expose({ name: 'HTTP_URL_LIMIT' })
  HTTP_URL_LIMIT: string;

  @Description('USE CSURF')
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @Expose({ name: 'USE_CSURF' })
  USE_CSURF: boolean;

  @Description('AWS REGION')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? 'ap-northeast-2')
  @Expose({ name: 'AWS_REGION' })
  AWS_REGION: string;

  @Description('AWS APPSYNC ENDPOINT')
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'AWS_APPSYNC_ENDPOINT' })
  AWS_APPSYNC_ENDPOINT: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    strategy: 'exposeAll',
    excludePrefixes: ['npm_', '_', 'PATH', 'NVM_'],
    enableImplicitConversion: false,
    exposeUnsetFields: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    for (const error of errors) {
      const checkPoint = [
        _.get(error, 'property'),
        _.get(error, 'value', '<Empty>'),
      ].join(': ');
      const constraints = Object.values(
        _.get(error, 'constraints', {}),
      ).toString();
      Logger.error(`[${checkPoint}] ${constraints}`, LogType.Environment);
    }

    throw new Error(Object.values(_.get(errors, '0.constraints')).toString());
  }

  if (validatedConfig.ENV !== NodeEnvironment.Development) {
    Object.entries(validatedConfig).map((v: [string, unknown]) =>
      Logger.log(v.join(': '), LogType.Environment),
    );
  }

  return validatedConfig;
}

export type EnvironmentKey = keyof EnvironmentVariables;

export const getEnvFilePath = (): string =>
  path.join(
    process.cwd(),
    `/env/.env.${
      process.env.NODE_ENV === NodeEnvironment.Local
        ? NodeEnvironment.Development
        : process.env.NODE_ENV ?? NodeEnvironment.Development
    }`,
  );
