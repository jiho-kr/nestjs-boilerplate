import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { EventDto } from './event.dto';
import { InstalledAppDto } from './installed-app.dto';

export class EventDataDto {
  @ApiProperty({
    type: InstalledAppDto,
    description: 'Installed App Information',
  })
  @ValidateNested()
  @Type(() => InstalledAppDto)
  installedApp: InstalledAppDto;

  @ApiProperty({
    type: EventDto,
    description: 'Event',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
