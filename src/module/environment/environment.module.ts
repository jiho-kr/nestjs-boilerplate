import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvironmentService } from './environment.service';
import { getEnvFilePath, validate } from './environment.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [getEnvFilePath()],
      isGlobal: true,
      cache: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
