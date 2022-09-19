import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'AccessToken',
    example: '707eaa09-21b5-4dbc-a513-2daa65adb56c',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token Type',
    example: 'bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Refresh Token',
    example: 'e65e8629-78c2-4298-a6f6-5fb7bd892d46',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Expires in (minute)',
    example: 86_400,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Scope',
    example: 'r:devices:*',
  })
  scope: string;

  @ApiProperty({
    description: 'Installed App ID',
    example: '2134ad31-eb58-4d98-b5b1-84204099be20',
  })
  installed_app_id: string;

  @ApiProperty({
    description: 'Access Tier',
    example: 0,
  })
  access_tier: number;
}
