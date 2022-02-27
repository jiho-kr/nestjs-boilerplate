import { forwardRef, Module } from '@nestjs/common';

import { EnvironmentModule } from '../environment/environment.module';
import { AwsAppSyncService } from './aws-appsync.service';
import { AwsDevelopmentController } from './aws-development.controller';

@Module({
  imports: [forwardRef(() => EnvironmentModule)],
  controllers: [AwsDevelopmentController],
  providers: [AwsAppSyncService],
  exports: [AwsAppSyncService],
})
export class AwsModule {}
