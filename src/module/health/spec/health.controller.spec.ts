import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { HealthController } from '../health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile();

    controller = app.get<HealthController>(HealthController);
  });

  describe('ping', () => {
    it('should return "OK"', () => {
      expect(controller.check()).toBe('OK');
    });
  });
});
