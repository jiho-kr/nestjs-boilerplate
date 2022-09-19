import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type {
  CapabilityStatus,
  CommandResponse,
  ComponentStatus,
  Device,
  DeviceHealth,
} from '@smartthings/core-sdk';
import { Command } from '@smartthings/core-sdk';

import { ApiHeaderPat } from './api-header-pat.decorator';
import { ApiParamDeviceId } from './api-param-device-id.decorator';
import { SmartThingsManagementService } from './smart-things.management.service';

/**
 * SmartThings Device 관리를 위한 Controller
 */
@Controller('smart-things/device')
@ApiTags('SmartThings/device')
export class SmartThingsDeviceController {
  constructor(
    private readonly smartThingsManagementService: SmartThingsManagementService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Device 조회',
    description: 'Device 목록을 조회',
  })
  @ApiHeaderPat()
  @ApiOkResponse({
    description: 'Device List',
  })
  async getDeviceList(
    @Headers('personal-access-token') pat: string,
  ): Promise<Device[]> {
    return this.smartThingsManagementService.getDeviceList(pat);
  }

  @Get(':deviceId')
  @ApiOperation({
    summary: 'Device 조회',
    description: 'Device 정보 조회',
  })
  @ApiHeaderPat()
  @ApiParamDeviceId()
  @ApiOkResponse({
    description: 'Device',
  })
  async getDevice(
    @Headers('personal-access-token') pat: string,
    @Param('deviceId') deviceId: string,
  ): Promise<Device> {
    return this.smartThingsManagementService.getDevice(pat, deviceId);
  }

  @Get(':deviceId/component/:componentId')
  @ApiOperation({
    summary: 'Device의 Component 조회',
    description: 'Device의 Component 정보 조회',
  })
  @ApiHeaderPat()
  @ApiParamDeviceId()
  @ApiParam({
    name: 'componentId',
    type: String,
    description: 'Component ID',
    required: true,
  })
  @ApiOkResponse({
    description: 'ComponentStatus',
  })
  async getDeviceComponentStatus(
    @Headers('personal-access-token') pat: string,
    @Param('deviceId') deviceId: string,
    @Param('componentId') componentId: string,
  ): Promise<ComponentStatus> {
    return this.smartThingsManagementService.getComponentStatus(
      pat,
      deviceId,
      componentId,
    );
  }

  @Get(':deviceId/component/:componentId/capability/:capabilityId')
  @ApiOperation({
    summary: 'Device의 Capability Status',
    description: 'Device의 Capability 정보 조회',
  })
  @ApiHeaderPat()
  @ApiParamDeviceId()
  @ApiParam({
    name: 'componentId',
    type: String,
    description: 'Component ID',
    required: true,
  })
  @ApiParam({
    name: 'capabilityId',
    type: String,
    description: 'Capability ID',
    required: true,
  })
  @ApiOkResponse({
    description: 'CapabilityStatus',
  })
  async getDeviceCapabilityStatus(
    @Headers('personal-access-token') pat: string,
    @Param('deviceId') deviceId: string,
    @Param('componentId') componentId: string,
    @Param('capabilityId') capabilityId: string,
  ): Promise<CapabilityStatus> {
    return this.smartThingsManagementService.getDeviceCapabilityStatus(
      pat,
      deviceId,
      componentId,
      capabilityId,
    );
  }

  @Get(':deviceId/health')
  @ApiOperation({
    summary: 'Device Health',
    description: 'Get Device Health',
  })
  @ApiHeaderPat()
  @ApiParamDeviceId()
  @ApiOkResponse({
    description: 'DeviceHealth',
  })
  async deviceHealth(
    @Headers('personal-access-token') pat: string,
    @Param('deviceId') deviceId: string,
  ): Promise<DeviceHealth> {
    return this.smartThingsManagementService.getDeviceHealth(pat, deviceId);
  }

  @Post(':deviceId/command')
  @ApiOperation({
    summary: 'execute device command',
    description: 'execute device command',
  })
  @ApiOkResponse({
    description: 'CommandResponse',
  })
  async executeCommand(
    @Headers('personal-access-token') pat: string,
    @Param('deviceId') deviceId: string,
    @Body() command: Command,
  ): Promise<CommandResponse> {
    return this.smartThingsManagementService.executeCommands(
      pat,
      deviceId,
      command,
    );
  }
}
