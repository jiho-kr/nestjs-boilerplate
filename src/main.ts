import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { json, urlencoded } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import type { IncomingMessage, ServerResponse } from 'http';
import morganBody from 'morgan-body';

import { version } from '../package.json';
import { LogType } from './constant/log-types';
import { SentryInterceptor } from './interceptor/sentry.interceptor';
import { EnvironmentService } from './module/environment/environment.service';
import { MainModule } from './module/main.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    { cors: true },
  );

  const environmentService: EnvironmentService =
    app.get<EnvironmentService>(EnvironmentService);
  const isProduction = environmentService.isProduction();
  const port = environmentService.get<number>('LPORT');

  Sentry.init({
    dsn: environmentService.get<string>('SENTRY_URL'),
    enabled: environmentService.get<boolean>('USE_SENTRY'),
    release: version,
    environment: environmentService.get<string>('ENV'),
    attachStacktrace: true,
  });

  app.setGlobalPrefix(environmentService.get<string>('API_VERSION'), {
    exclude: [
      { path: '/health', method: RequestMethod.GET },
      { path: '/maintenance', method: RequestMethod.GET },
      { path: '/version', method: RequestMethod.GET },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (!isProduction) {
    setupSwagger(app);
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    json({ limit: environmentService.get<string>('HTTP_BODY_SIZE_LIMIT') }),
  );

  app.use(
    urlencoded({
      extended: true,
      limit: environmentService.get<string>('HTTP_URL_LIMIT'),
    }),
  );

  morganBody(app.getHttpAdapter().getInstance(), {
    noColors: true,
    prettify: false,
    includeNewLine: false,
    skip(_req: IncomingMessage, res: ServerResponse) {
      if (_req.url === '/health') {
        return true;
      }
      return isProduction ? res.statusCode < 400 : false;
    },
    stream: {
      write: (message: string) => {
        Logger.log(message.replace('\n', ''), LogType.Http);
        return true;
      },
    },
  });
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new SentryInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      validationError: {
        target: true,
        value: true,
      },
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  if (environmentService.get<boolean>('USE_CSURF')) {
    app.use(cookieParser());
    app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(csurf());
  }

  await app.listen(port);
  Logger.log(
    `Server ${environmentService.get<string>('ENV')} running on port ${port}`,
    'START',
  );
}

void bootstrap();
