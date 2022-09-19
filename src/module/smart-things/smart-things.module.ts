import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { EnvironmentModule } from '../environment/environment.module';
import { SmartThingsAppController } from './smart-things.app.controller';
import { SmartThingsController } from './smart-things.controller';
import { SmartThingsDeviceController } from './smart-things.device.controller';
import { SmartThingsLocationController } from './smart-things.location.controller';
import { SmartThingsManagementController } from './smart-things.management.controller';
import { SmartThingsManagementService } from './smart-things.management.service';
import { SmartSubscriptionThingsService } from './smart-things.subscription.service';

@Module({
  imports: [forwardRef(() => EnvironmentModule), HttpModule],
  controllers: [
    SmartThingsController,
    SmartThingsAppController,
    SmartThingsDeviceController,
    SmartThingsLocationController,
    SmartThingsManagementController,
  ],
  providers: [SmartSubscriptionThingsService, SmartThingsManagementService],
  exports: [SmartSubscriptionThingsService, SmartThingsManagementService],
})
export class SmartThingsModule {}
