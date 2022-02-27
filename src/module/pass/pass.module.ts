import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import qs from 'qs';

import { EnvironmentModule } from '../environment/environment.module';
import { EnvironmentService } from '../environment/environment.service';
import { PassService } from './pass.service';

const GRMS_PASS_API_VERSION = 'v2';
@Module({
  imports: [
    forwardRef(() => EnvironmentModule),
    HttpModule.registerAsync({
      imports: [EnvironmentModule],
      useFactory: (environmentService: EnvironmentService) => ({
        baseURL: [
          environmentService.get<string>('GRMS_PASS_API_URL'),
          GRMS_PASS_API_VERSION,
        ].join('/'),
        headers: {
          Authorization: 'Bearer xxxxxx',
        },
        timeout: 3000,
        maxRedirects: 5,
        retries: 1,
        retryDelay: () => 50,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      }),
      inject: [EnvironmentService],
    }),
  ],
  providers: [PassService],
  exports: [PassService],
})
export class PassModule {}
