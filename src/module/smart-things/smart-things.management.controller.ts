import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Capability } from '@smartthings/core-sdk';

import { ApiHeaderPat } from './api-header-pat.decorator';
import { AccessTokenRequestDto } from './dto/access-token-request.dto';
import type { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { SmartThingsManagementService } from './smart-things.management.service';

/**
 * SmartThings 관리를 위한 Controller
 */
@Controller('smart-things')
@ApiTags('SmartThings/management')
export class SmartThingsManagementController {
  constructor(
    private readonly smartThingsManagementService: SmartThingsManagementService,
  ) {}

  @Get('code-url/:clientId')
  @ApiOperation({
    summary: 'code URL 조회',
    description: 'Client ID로 auth Code를 획득할 URL 조회.',
  })
  @ApiCreatedResponse({
    description: 'code URL',
    type: String,
  })
  @ApiParam({
    name: 'clientId',
    type: String,
    description: 'Client ID',
    required: true,
  })
  getCodeUrl(@Param('clientId') clientId: string): string {
    return this.smartThingsManagementService.getCodeUrl(clientId);
  }

  @Post('access-token')
  @ApiOperation({
    summary: 'AccessToken 획득',
    description: 'AccessToken을 발급',
  })
  async redeemCode(
    @Body() accessTokenRequestDto: AccessTokenRequestDto,
  ): Promise<AccessTokenResponseDto> {
    return this.smartThingsManagementService.redeemCode(accessTokenRequestDto);
  }

  @Get('capability/:capabilityId/:version')
  @ApiOperation({
    summary: 'Capability',
    description: 'Version별 Capability 조회',
  })
  @ApiHeaderPat()
  @ApiParam({
    name: 'capabilityId',
    type: String,
    description: 'Capability ID',
    required: true,
  })
  @ApiParam({
    name: 'version',
    type: String,
    description: 'Capability Version',
    required: true,
  })
  @ApiOkResponse({
    description: 'Capability',
  })
  async getCapability(
    @Headers('personal-access-token') pat: string,
    @Param('capabilityId') capabilityId: string,
    @Param('version') version: number,
  ): Promise<Capability> {
    return this.smartThingsManagementService.getCapability(
      pat,
      capabilityId,
      version,
    );
  }
}
