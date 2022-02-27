import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

import { EnvironmentService } from '../environment/environment.service';

@Controller('maintenance')
@ApiTags('maintenance')
export class MaintenanceController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly environmentService: EnvironmentService,
  ) {}

  @ApiOperation({
    summary: 'Maintenance',
    description: '서버 상태 반환',
  })
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.memory.checkRSS('mem_rss', 512 * 2 ** 20 /* 512 MB */),
      () =>
        this.http.pingCheck(
          'grms-pass',
          `${this.environmentService.get<string>('GRMS_PASS_API_URL')}/health`,
        ),
      () =>
        this.http.pingCheck(
          'grms-service',
          `${this.environmentService.get<string>(
            'GRMS_SERVICE_API_URL',
          )}/health`,
        ),
      () =>
        this.http.pingCheck(
          'grms-device-control',
          `${this.environmentService.get<string>(
            'GRMS_CONTROL_API_URL',
          )}/health`,
        ),
      () =>
        this.http.pingCheck(
          'grms-device-management',
          `${this.environmentService.get<string>(
            'GRMS_MANAGEMENT_API_URL',
          )}/health`,
        ),
      () =>
        this.http.pingCheck(
          'grms-opeanapi-for-service',
          `${this.environmentService.get<string>(
            'GRMS_OPENAPI_FOR_SERVICE_URL',
          )}/health`,
        ),
    ]);
  }
}
