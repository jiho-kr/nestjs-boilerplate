import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor() {}

  @ApiOperation({
    summary: 'Health',
    description: 'OK',
  })
  @Get()
  @ApiOkResponse({ type: String, description: 'OK' })
  check(): string {
    return 'OK';
  }
}
