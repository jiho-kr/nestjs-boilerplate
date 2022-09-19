import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationEventDto {
  @ApiProperty({
    type: String,
    description: 'App ID',
    example: 'ea7v23u7-a971-23r2-81e2-823t2cb24dc7',
  })
  @IsString()
  @IsNotEmpty()
  appId: string;

  @ApiProperty({
    type: String,
    description: 'Confirmation URL',
    example: 'https://my-confirmation-url.com',
  })
  @IsString()
  @IsNotEmpty()
  confirmationUrl: string;
}
