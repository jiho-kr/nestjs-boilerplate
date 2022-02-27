import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class SpaceIdsDto {
  @ApiProperty({
    type: [Number],
    description: 'Space IDs',
    example: '[31, 34]',
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  spaceIds: number[];
}
