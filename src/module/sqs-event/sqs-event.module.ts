import { CacheModule, forwardRef, Module } from '@nestjs/common';

import { AwsModule } from '../aws/aws.module';
import { SqsEventController } from './sqs-event.controller';

@Module({
  imports: [
    forwardRef(() => AwsModule),
    CacheModule.register({
      ttl: 5, // 5 seconds
      max: 86_400, // 1 day
    }),
  ],
  controllers: [SqsEventController],
  providers: [],
})
export class SqsEventModule {}
