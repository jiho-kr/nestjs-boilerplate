import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

import { DatetimeString } from '../../../class-validator/datetime-string';
import { PassDto } from './pass.dto';

export class PassModifyDto extends PickType(PassDto, [
  'language',
  'passKeyShareLimit',
]) {
  @ApiProperty({
    type: String,
    description: '체크인 시간',
    example: '2021-11-19 09:44:06',
  })
  @Validate(DatetimeString)
  @IsNotEmpty()
  checkin: string;

  @ApiProperty({
    type: String,
    description: '체크아웃 시간',
    example: '2021-11-19 12:44:18',
  })
  @Validate(DatetimeString)
  @IsNotEmpty()
  checkout: string;
}
