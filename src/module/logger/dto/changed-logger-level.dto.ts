import type { LogLevel } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ChangedLoggerLevelDto {
  @ApiProperty({ description: 'LogLevel' })
  @IsArray()
  logLevel: LogLevel[];
}
