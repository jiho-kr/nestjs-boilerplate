import { ApiProperty } from '@nestjs/swagger';
import type { RefreshData } from '@smartthings/core-sdk';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriptionRegisterDto implements RefreshData {
  @ApiProperty({
    type: String,
    description: 'Access Token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh Token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: 'Client ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    type: String,
    description: 'Client Secret',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty({
    type: String,
    description: 'Location ID',
    required: true,
    example: '75781def-e090-4e2a-9704-a2776c1ec795',
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    type: String,
    description: 'Capability',
    required: true,
    example: 'switch',
  })
  @IsString()
  capability: string;
}
