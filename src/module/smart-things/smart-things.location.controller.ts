import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  Device,
  LocationItem,
  Room,
  ServiceLocationInfo,
} from '@smartthings/core-sdk';

import { ApiHeaderPat } from './api-header-pat.decorator';
import { ApiParamLocationId } from './api-param-location-id.decorator';
import { SmartThingsManagementService } from './smart-things.management.service';

/**
 * SmartThings Location 관리를 위한 Controller
 */
@Controller('smart-things/location')
@ApiTags('SmartThings/location')
export class SmartThingsLocationController {
  constructor(
    private readonly smartThingsManagementService: SmartThingsManagementService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Location 목록',
    description: 'Location List',
  })
  @ApiHeaderPat()
  @ApiOkResponse({
    description: 'Location Items',
  })
  async getLocationList(
    @Headers('personal-access-token') pat: string,
  ): Promise<LocationItem[]> {
    return this.smartThingsManagementService.getLocationList(pat);
  }

  @Get(':locationId')
  @ApiOperation({
    summary: 'Location 조회',
    description: 'Location의 정보를 조회',
  })
  @ApiHeaderPat()
  @ApiParamLocationId()
  @ApiOkResponse({
    description: 'ServiceLocationInfo',
  })
  async getLocationServiceInfo(
    @Headers('personal-access-token') pat: string,
    @Param('locationId') locationId: string,
  ): Promise<ServiceLocationInfo> {
    return this.smartThingsManagementService.getLocationServiceInfo(
      pat,
      locationId,
    );
  }

  @Get(':locationId/device')
  @ApiOperation({
    summary: 'Location의 Device 조회',
    description: 'Location의 Device 목록을 조회',
  })
  @ApiHeaderPat()
  @ApiParamLocationId()
  @ApiOkResponse({
    description: 'Device[]',
  })
  async getDeviceByLocationID(
    @Headers('personal-access-token') pat: string,
    @Param('locationId') locationId: string,
  ): Promise<Device[]> {
    return this.smartThingsManagementService.getDeviceList(pat, locationId);
  }

  @Get(':locationId/room')
  @ApiOperation({
    summary: 'Location의 Room 조회',
    description: 'Location의 Room 목록을 조회',
  })
  @ApiHeaderPat()
  @ApiParamLocationId()
  @ApiOkResponse({
    description: 'Room[]',
  })
  async getRoomList(
    @Headers('personal-access-token') pat: string,
    @Param('locationId') locationId: string,
  ): Promise<Room[]> {
    return this.smartThingsManagementService.getRoomList(pat, locationId);
  }
}
