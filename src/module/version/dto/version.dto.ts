import { ApiProperty } from '@nestjs/swagger';

import { NodeEnvironment } from '../../environment/environment.validation';

export class VersionDto {
  @ApiProperty({
    type: String,
    description: 'environment',
    examples: [
      NodeEnvironment.Development,
      NodeEnvironment.Qa,
      NodeEnvironment.Stage,
      NodeEnvironment.Production,
    ],
  })
  environment: string;

  @ApiProperty({ type: String, description: 'version', example: '1.0.0' })
  version: string;

  @ApiProperty({ type: Number, description: 'Uptime' })
  uptime: number;
}
