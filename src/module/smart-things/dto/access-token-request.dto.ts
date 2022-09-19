import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenRequestDto {
  @ApiProperty({
    type: String,
    description: 'Client ID',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    type: String,
    description: 'Client Secret',
  })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty({
    type: String,
    description: 'Auth Code',
  })
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
