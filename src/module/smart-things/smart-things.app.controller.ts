import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type {
  AppResponse,
  PagedApp,
  Subscription,
} from '@smartthings/core-sdk';

import { ApiHeaderPat } from './api-header-pat.decorator';
import { ApiParamAppId } from './api-param-app-id.decorator';
import { RegisterAppRequestDto } from './dto/register-app-request.dto';
import { RegisterAppResponseDto } from './dto/register-app-response.dto';
import { SubscriptionRegisterDto } from './dto/subscription-register.dto';
import { SmartThingsManagementService } from './smart-things.management.service';

/**
 * SmartThings App 관리를 위한 Controller
 */
@Controller('smart-things/app')
@ApiTags('SmartThings/app')
export class SmartThingsAppController {
  constructor(
    private readonly smartThingsManagementService: SmartThingsManagementService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'APP 생성',
    description: 'App을 생성합니다.',
  })
  @ApiHeaderPat()
  @ApiCreatedResponse({
    description: 'App Information',
    type: RegisterAppResponseDto,
  })
  async registerApp(
    @Headers('personal-access-token') pat: string,
    @Body() registerAppRequestDto: RegisterAppRequestDto,
  ): Promise<RegisterAppResponseDto> {
    return this.smartThingsManagementService.registerApp(
      pat,
      registerAppRequestDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'App List',
    description: '등록된 App List를 조회합니다',
  })
  @ApiHeaderPat()
  @ApiOkResponse({
    description: 'PagedApp[]',
  })
  async getAppList(
    @Headers('personal-access-token') pat: string,
  ): Promise<PagedApp[]> {
    return this.smartThingsManagementService.getAppList(pat);
  }

  @Get(':appId')
  @ApiOperation({
    summary: 'App Information',
    description: '등록된 App 정보를 조회합니다',
  })
  @ApiHeaderPat()
  @ApiParamAppId()
  @ApiOkResponse({
    description: 'AppResponse',
  })
  async getApp(
    @Headers('personal-access-token') pat: string,
    @Param('appId') appId: string,
  ): Promise<AppResponse> {
    return this.smartThingsManagementService.getApp(pat, appId);
  }

  @Delete(':appId')
  @ApiOperation({
    summary: 'Delete App',
    description: '등록된 App을 삭제합니다',
  })
  @ApiHeaderPat()
  @ApiParamAppId()
  @ApiOkResponse()
  async deleteApp(
    @Headers('personal-access-token') pat: string,
    @Param('appId') appId: string,
  ): Promise<void> {
    await this.smartThingsManagementService.deleteApp(pat, appId);
  }

  @Post(':appId/subscription')
  @ApiOperation({
    summary: 'Create subscription',
    description: 'Create subscription',
  })
  @ApiOkResponse({
    description: 'Subscription',
  })
  async registerSubscription(
    @Param('appId') appId: string,
    @Body() subscriptionRegisterDto: SubscriptionRegisterDto,
  ): Promise<Subscription> {
    const {
      accessToken,
      refreshToken,
      clientId,
      clientSecret,
      locationId,
      capability,
    } = subscriptionRegisterDto;
    return this.smartThingsManagementService.createSubscription(
      this.smartThingsManagementService.getSmartThingsClientByAccessToken(
        accessToken,
        {
          refreshToken,
          clientId,
          clientSecret,
        },
      ),
      appId,
      locationId,
      capability,
    );
  }
}
