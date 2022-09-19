import { ApiProperty } from '@nestjs/swagger';
import type { AppCreationResponse } from '@smartthings/core-sdk';

export class RegisterAppResponseDto {
  @ApiProperty({
    type: String,
    description: 'App ID',
    example: '163415a9-adaf-424a-b882-f3f559c6dda2',
  })
  appId: string;

  @ApiProperty({
    type: String,
    description: 'Client ID',
    example: '49aa2df8-df8b-4f2b-8090-bb6bd64a9966',
  })
  clientId: string;

  @ApiProperty({
    type: String,
    description: 'Client Secret',
    example: '46fd6209-f9e8-4197-aab6-168bb0e43a7f',
  })
  clientSecret: string;

  @ApiProperty({
    type: String,
    description: 'Access this url to get the code',
    example: 'https://api.smartthings.com/oauth/authorize?client_id=...',
  })
  url: string;

  constructor(appCreationResponse: AppCreationResponse, codeUrl: string) {
    this.appId = appCreationResponse.app.appId;
    this.clientId = appCreationResponse.oauthClientId;
    this.clientSecret = appCreationResponse.oauthClientSecret;
    this.url = codeUrl;
  }
}
