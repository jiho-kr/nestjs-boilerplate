import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { MainModule } from '../../main.module';

describe('MaintenanceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/maintenance (GET)', () =>
    request(app.getHttpServer())
      .get('/maintenance')
      .expect(200)
      .expect({
        status: 'ok',
        info: {
          // eslint-disable-next-line prettier/prettier
          'mem_rss': { status: 'up' },
          'grms-pass': { status: 'up' },
          'grms-service': { status: 'up' },
          'grms-device-control': { status: 'up' },
          'grms-device-management': { status: 'up' },
          'grms-opeanapi-for-service': { status: 'up' },
        },
        error: {},
        details: {
          // eslint-disable-next-line prettier/prettier
          'mem_rss': { status: 'up' },
          'grms-pass': { status: 'up' },
          'grms-service': { status: 'up' },
          'grms-device-control': { status: 'up' },
          'grms-device-management': { status: 'up' },
          'grms-opeanapi-for-service': { status: 'up' },
        },
      }));
});
