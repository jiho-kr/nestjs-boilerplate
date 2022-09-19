import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class RegisterAppRequestDto {
  @ApiProperty({
    type: String,
    description: 'App Name, App Name must be unique.',
    default: 'grms-f9eaca96-7b9f-41c2-b016-52f82b6b6a06',
  })
  @Transform(({ value }) => value ?? `grms-${uuid()}`)
  @IsString()
  @IsNotEmpty()
  appName: string;

  @ApiProperty({
    type: String,
    description: 'Display Name',
    default: 'Yanolja GRMS',
  })
  @Transform(({ value }) => value ?? 'Yanolja GRMS')
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    type: String,
    description: 'Display Name',
    default: 'Yanolja GRMS',
  })
  @Transform(({ value }) => value ?? 'Yanolja GRMS')
  @IsString()
  @IsNotEmpty()
  description: string;
}
