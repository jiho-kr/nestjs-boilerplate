import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import os from 'os';

import { version } from '../../../package.json';
import { EnvironmentService } from '../environment/environment.service';
import { VersionDto } from './dto/version.dto';

@Controller('version')
@ApiTags('maintenance')
export class VersionController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @ApiOperation({
    summary: 'Version',
    description: 'Current Environment information',
  })
  @Get()
  @ApiOkResponse({
    type: VersionDto,
    description: 'version & environment',
  })
  version(): VersionDto {
    const environment = this.environmentService.get<string>('ENV');
    const uptime = os.uptime();
    return {
      environment,
      version,
      uptime,
    };
  }
}
