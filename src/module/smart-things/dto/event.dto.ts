import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { DeviceEventDto } from './device-event.dto';

export enum EventType {
  DEVICE_EVENT = 'DEVICE_EVENT',
  TIMER_EVENT = 'TIMER_EVENT',
  DEVICE_COMMANDS_EVENT = 'DEVICE_COMMANDS_EVENT',
  DEVICE_LIFECYCLE_EVENT = 'DEVICE_LIFECYCLE_EVENT',
  DEVICE_HEALTH_EVENT = 'DEVICE_HEALTH_EVENT',
  HUB_HEALTH_EVENT = 'HUB_HEALTH_EVENT',
  MODE_EVENT = 'MODE_EVENT',
  SECURITY_ARM_STATE_EVENT = 'SECURITY_ARM_STATE_EVENT',
  SCENE_LIFECYCLE_EVENT = 'SCENE_LIFECYCLE_EVENT',
  INSTALLED_APP_LIFECYCLE_EVENT = 'INSTALLED_APP_LIFECYCLE_EVENT',
}

export class EventDto {
  @ApiProperty({
    type: String,
    description: 'Event Time, ISO Date string',
    example: '2019-01-09T19:58:11Z',
  })
  @IsNotEmpty()
  @IsString()
  eventTime: string;

  @ApiProperty({
    type: String,
    description: 'Event Type',
    enum: EventType,
  })
  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;

  @ApiPropertyOptional({
    type: DeviceEventDto,
    description: 'case DEVICE_EVENT',
  })
  @ValidateIf((o) => o.eventType === EventType.DEVICE_EVENT)
  @ValidateNested()
  @Type(() => DeviceEventDto)
  deviceEvent?: DeviceEventDto;
}
