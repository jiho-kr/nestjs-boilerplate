import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { version } from '../../../../package.json';
import { MainModule } from '../../main.module';

describe('VersionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/version (GET)', () =>
    request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            environment: 'development',
            version,
            uptime: expect.any(Number),
          }),
        );
      }));
});
