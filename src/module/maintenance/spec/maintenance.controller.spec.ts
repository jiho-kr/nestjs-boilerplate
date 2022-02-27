import type { HealthIndicatorFunction } from '@nestjs/terminus';
import {
  HealthCheckService,
  HealthIndicator,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MainModule } from '../../main.module';
import { MaintenanceController } from '../maintenance.controller';

class MockHealthIndicator extends HealthIndicator {
  public pingCheck(key: string) {
    return super.getStatus(key, true, { message: 'Up' });
  }

  public checkRSS(key: string) {
    return super.getStatus(key, true, { message: 'Up' });
  }
}

describe('MaintenanceController', () => {
  let controller: MaintenanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check(indicators: HealthIndicatorFunction[]) {
          return Promise.resolve(indicators.map((indicator) => indicator()));
        },
      })
      .overrideProvider(HttpHealthIndicator)
      .useClass(MockHealthIndicator)
      .overrideInterceptor(MemoryHealthIndicator)
      .useClass(MockHealthIndicator)
      .compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it.skip('should check status', async () => {
    await expect(controller.check()).resolves.toBeDefined();
  });
});
