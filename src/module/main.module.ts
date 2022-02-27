import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { contextMiddleware } from '../middleware/context.middleware';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { DeviceControlModule } from './device-control/device-control.module';
import { DeviceManagementModule } from './device-management/device-management.module';
import { EnvironmentModule } from './environment/environment.module';
import { GrmsServiceModule } from './grms-service/grms-service.module';
import { HealthController } from './health/health.controller';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { PassModule } from './pass/pass.module';
import { PmsModule } from './pms/pms.module';
import { VersionController } from './version/version.controller';

@Module({
  imports: [
    EnvironmentModule,
    PmsModule,
    AuthModule,
    PassModule,
    GrmsServiceModule,
    DeviceManagementModule,
    DeviceControlModule,
    TerminusModule,
    AwsModule,
  ],
  controllers: [MaintenanceController, HealthController, VersionController],
  providers: [],
  exports: [],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
