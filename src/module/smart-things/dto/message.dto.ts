import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { ConfirmationEventDto } from './confirmation-message.dto';
import { EventDataDto } from './event-data.dto';

export enum MessageType {
  CONFIRMATION = 'CONFIRMATION',
  CONFIGURATION = 'CONFIGURATION',
  OAUTH_CALLBACK = 'OAUTH_CALLBACK',
  INSTALL = 'INSTALL',
  UNINSTALL = 'UNINSTALL',
  UPDATE = 'UPDATE',
  EVENT = 'EVENT',
  PING = 'PING', // ping is deprecated
}

export class MessageDto {
  @ApiProperty({
    type: String,
    description: 'Message Type',
    example: MessageType,
  })
  @IsEnum(MessageType)
  @IsNotEmpty()
  lifecycle: MessageType;

  @ApiProperty({ example: '7BF0C51D-E177-4824-90A9-67A8B6F6D80C' })
  @IsString()
  executionId: string;

  @ApiProperty({ example: '154aaebf-da5c-492a-a974-ee79c2109034' })
  @IsString()
  appId: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  locale: string;

  @ApiProperty({ example: '0.1.0' })
  @IsString()
  version: string;

  @ApiPropertyOptional({
    type: ConfirmationEventDto,
    description: 'Case Confirmation Event',
  })
  @ValidateIf((o) => o.lifecycle === MessageType.CONFIRMATION)
  @ValidateNested()
  @Type(() => ConfirmationEventDto)
  confirmationData?: ConfirmationEventDto;

  @ApiPropertyOptional({ type: EventDataDto, description: 'Case Event' })
  @ValidateIf((o) => o.lifecycle === MessageType.EVENT)
  @ValidateNested()
  @Type(() => EventDataDto)
  eventData?: EventDataDto;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
