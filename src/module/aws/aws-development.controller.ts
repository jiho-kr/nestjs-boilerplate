import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiParams, ParamName } from '../../decorator';
import { OnlyDevelopment } from '../../guard/development.guard';
import { AwsAppSyncService } from './aws-appsync.service';
import { SpaceIdsDto } from './dto/space-ids.dto';

@Controller('aws-development')
@ApiTags('aws-development')
export class AwsDevelopmentController {
  constructor(private readonly awsAppSyncService: AwsAppSyncService) {}

  @ApiOperation({
    summary: 'AppSync Test',
    description: 'AppSync updatedSpacesState Test',
  })
  @Put('appsync/spacestate/:propertyId')
  @ApiParams(ParamName.PropertyId)
  @UseGuards(OnlyDevelopment)
  async appSyncSpaceState(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() spaceIdsDto: SpaceIdsDto,
  ): Promise<unknown> {
    return this.awsAppSyncService.updatedSpacesState(
      propertyId,
      spaceIdsDto.spaceIds,
    );
  }
}
