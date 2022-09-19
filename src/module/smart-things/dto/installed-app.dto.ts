import { ApiProperty } from '@nestjs/swagger';

export class InstalledAppDto {
  @ApiProperty({
    type: String,
    description: 'App ID',
    example: '4a918792-d56a-4f79-b725-0f02503fe096',
  })
  installedAppId: string;

  @ApiProperty({
    type: String,
    description: 'Location ID',
    example: 'd172054e-fee1-4f8f-acb1-cfd0acea5355',
  })
  locationId: string;
}
