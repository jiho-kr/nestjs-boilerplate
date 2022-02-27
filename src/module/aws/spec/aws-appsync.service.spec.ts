import { Logger } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { EnvironmentService } from '../../environment/environment.service';
import { AwsModule } from '../aws.module';
import { AwsAppSyncService } from '../aws-appsync.service';

describe('AppSyncService', () => {
  let service: AwsAppSyncService;

  beforeEach(async () => {
    process.env.NODE_ENV = 'local';
    const app: TestingModule = await Test.createTestingModule({
      imports: [AwsModule],
      providers: [EnvironmentService],
    })
      .setLogger(new Logger())
      .compile();

    service = app.get<AwsAppSyncService>(AwsAppSyncService);
  });

  it.skip('updatedSpacesState', async () => {
    const result = await service.updatedSpacesState(10_014, [31, 34]);
    expect(result).toBeUndefined();
  });
});
