import { Injectable, Logger } from '@nestjs/common';
import type {
  AppResponse,
  Capability,
  CapabilityStatus,
  Command,
  CommandResponse,
  ComponentStatus,
  Device,
  DeviceHealth,
  LocationItem,
  PagedApp,
  RefreshData,
  Room,
  ServiceLocationInfo,
  Subscription,
} from '@smartthings/core-sdk';
import {
  AppClassification,
  AppType,
  BearerTokenAuthenticator,
  defaultSmartThingsURLProvider,
  RefreshTokenAuthenticator,
  SignatureType,
  SmartThingsClient,
  SmartThingsOAuthClient,
  SubscriptionSource,
} from '@smartthings/core-sdk';
import _ from 'lodash';

import { EnvironmentService } from '../environment/environment.service';
import type { AccessTokenRequestDto } from './dto/access-token-request.dto';
import type { AccessTokenResponseDto } from './dto/access-token-response.dto';
import type { RegisterAppRequestDto } from './dto/register-app-request.dto';
import { RegisterAppResponseDto } from './dto/register-app-response.dto';
import { SmartThinsLogger } from './smart-things.logger';
import { TokenStore } from './token-store';

/**
 * SmartThings를 관리하는 서비스
 */
@Injectable()
export class SmartThingsManagementService {
  private externalUrl: string;

  constructor(private readonly environmentService: EnvironmentService) {
    this.externalUrl = this.environmentService.get<string>('EXTERNAL_URL');
  }

  /**
   * 등록된 App List
   * @param pat
   * @returns PagedApp
   */
  async getAppList(pat: string): Promise<PagedApp[]> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const apps = await smartThingsClient.apps.list();
    return apps;
  }

  /**
   * PAT로 App을 등록합니다.
   * 생성된 App 정보와 oauthClientId, oauthClientSecret를 결과로 받습니다.
   * 이때 획득한 oauthClientId, oauthClientSecret는 oAuth 인증에 사용합니다.
   * @param pat
   * @param registerAppRequestDto
   * @returns RegisterAppResponseDto
   */
  async registerApp(
    pat: string,
    registerAppRequestDto: RegisterAppRequestDto,
  ): Promise<RegisterAppResponseDto> {
    // * AUTOMATION - Denotes an integration that should display under the "Automation" tab in mobile clients.
    // * SERVICE - Denotes an integration that is classified as a "Service".
    // * DEVICE - Denotes an integration that should display under the "Device" tab in mobile clients.
    // * CONNECTED_SERVICE - Denotes an integration that should display under the "Connected Services" menu in mobile clients.
    const { appName, displayName, description } = registerAppRequestDto;
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const appCreationResponse = await smartThingsClient.apps.create({
      appName,
      displayName,
      description,
      singleInstance: false,
      appType: AppType.WEBHOOK_SMART_APP,
      classifications: [AppClassification.AUTOMATION],
      webhookSmartApp: {
        targetUrl: `${this.externalUrl}/smart-things/subscribe`,
        signatureType: SignatureType.APP_RSA,
      },
      oauth: {
        clientName: 'GRMS SmartThings Integration',
        scope: ['r:devices:*', 'x:devices:*', 'r:locations:*', 'x:locations:*'],
        redirectUris: [`${this.externalUrl}/smart-things/oauth/callback`],
      },
    });

    return new RegisterAppResponseDto(
      appCreationResponse,
      this.getCodeUrl(appCreationResponse.oauthClientId),
    );
  }

  /**
   * App Information
   * @param pat
   * @param appId
   * @returns AppResponse
   */
  async getApp(pat: string, appId: string): Promise<AppResponse> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const appResponse = await smartThingsClient.apps.get(appId);
    return appResponse;
  }

  /**
   * Delete App
   * @param pat
   * @param appId
   */
  async deleteApp(pat: string, appId: string): Promise<void> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    await smartThingsClient.apps.delete(appId);
  }

  /**
   * AppId로 Code를 획득하기 위한 URL을 조회합니다.
   * @param clientId
   * @returns string
   */
  getCodeUrl(clientId: string): string {
    const params = [
      'response_type=code',
      `client_id=${clientId}`,
      `redirect_uri=${this.externalUrl}/smart-things/oauth/callback`,
      'scope=r:devices:* x:devices:*',
    ].join('&');
    const codeUrl = `${defaultSmartThingsURLProvider.baseURL}/oauth/authorize?${params}`;
    return codeUrl;
  }

  /**
   * registerApp을 통해 획득한 ClientId와 ClientSecret을 통해 oAuth 인증을 통해 AccessToken을 획득합니다.
   * @param authCode
   * @return
   */
  async redeemCode(
    accessTokenRequestDto: AccessTokenRequestDto,
  ): Promise<AccessTokenResponseDto> {
    const { clientId, clientSecret, authCode } = accessTokenRequestDto;
    const smartThingsOAuthClient = new SmartThingsOAuthClient(
      clientId,
      clientSecret,
      'https://grms-smart-things-dev.yflux.biz/smart-things/oauth/callback',
    );
    const response = await smartThingsOAuthClient.redeemCode(authCode);
    return response;
  }

  /**
   * Location List
   * @param pat
   * @returns LocationItem[]
   */
  async getLocationList(pat: string): Promise<LocationItem[]> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const locationItems = await smartThingsClient.locations.list();
    return locationItems;
  }

  /**
   * Location Information
   * @param pat
   * @param locationId
   * @returns ServiceLocationInfo
   */
  async getLocationServiceInfo(
    pat: string,
    locationId: string,
  ): Promise<ServiceLocationInfo> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const serviceLocationInfo =
      await smartThingsClient.services.getLocationServiceInfo(locationId);
    return serviceLocationInfo;
  }

  /**
   * Device List
   * @param pat
   * @param locationId
   * @returns Device
   */
  async getDeviceList(
    pat: string,
    locationId?: string | string[],
  ): Promise<Device[]> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const deviceList = await smartThingsClient.devices.list({
      locationId,
    });

    return deviceList;
  }

  /**
   * Room List
   * @param pat
   * @param locationId
   * @returns Room
   */
  async getRoomList(pat: string, locationId: string): Promise<Room[]> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const rooms = await smartThingsClient.rooms.list(locationId);
    return rooms;
  }

  /**
   * Device Information
   * @param pat
   * @param deviceId
   * @returns Device
   */
  async getDevice(pat: string, deviceId: string): Promise<Device> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const device = await smartThingsClient.devices.get(deviceId);
    Logger.log(device);
    return device;
  }

  /**
   * Device Component Status
   * @param pat
   * @param deviceId
   * @param componentId
   * @returns ComponentStatus
   */
  async getComponentStatus(
    pat: string,
    deviceId: string,
    componentId: string,
  ): Promise<ComponentStatus> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const componentStatus = await smartThingsClient.devices.getComponentStatus(
      deviceId,
      componentId,
    );
    return componentStatus;
  }

  /**
   * Device Capability
   * @param pat
   * @param deviceId
   * @param componentId
   * @param capabilityId
   * @returns CapabilityStatus
   */
  async getDeviceCapabilityStatus(
    pat: string,
    deviceId: string,
    componentId: string,
    capabilityId: string,
  ): Promise<CapabilityStatus> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const capabilityStatus =
      await smartThingsClient.devices.getCapabilityStatus(
        deviceId,
        componentId,
        capabilityId,
      );
    return capabilityStatus;
  }

  /**
   * Capability
   * @param pat
   * @param capabilityId
   * @param capabilityVersion
   * @returns Capability
   */
  async getCapability(
    pat: string,
    capabilityId: string,
    capabilityVersion: number,
  ): Promise<Capability> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const capability = await smartThingsClient.capabilities.get(
      capabilityId,
      capabilityVersion,
    );
    return capability;
  }

  /**
   * Device Health
   * @param pat
   * @param deviceId
   * @returns DeviceHealth
   */
  async getDeviceHealth(pat: string, deviceId: string): Promise<DeviceHealth> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    const deviceHealth = await smartThingsClient.devices.getHealth(deviceId);
    return deviceHealth;
  }

  /**
   * Device Command
   * @param pat
   * @param deviceId
   * @param command
   * @returns CommandResponse
   */
  async executeCommands(
    pat: string,
    deviceId: string,
    command: Command,
  ): Promise<CommandResponse> {
    const smartThingsClient = this.getSmartThingsClientByPat(pat);
    Logger.log(command);
    const commandResponse = await smartThingsClient.devices.executeCommands(
      deviceId,
      [command],
    );
    // 'ACCEPTED' | 'COMPLETED' | 'FAILED'
    Logger.log(commandResponse);
    return commandResponse;
  }

  /**
   * PAT로 SmartThings 제어를 위한 Client
   * @param personalAccessToken
   * @returns SmartThingsClient
   */
  private getSmartThingsClientByPat(
    personalAccessToken: string,
  ): SmartThingsClient {
    return new SmartThingsClient(
      new BearerTokenAuthenticator(personalAccessToken),
      {
        logger: new SmartThinsLogger('trace'),
      },
    );
  }

  /**
   * AccessToken으로 Subscription을 생성합니다.
   * @param smartThingsClient
   * @param appId
   * @param deviceId
   * @returns
   */
  async createSubscription(
    smartThingsClient: SmartThingsClient,
    appId: string,
    locationId: string,
    capability: string,
  ): Promise<Subscription> {
    // declare enum SubscriptionSource {
    //   DEVICE = 'DEVICE',
    //   CAPABILITY = 'CAPABILITY',
    //   MODE = 'MODE',
    //   DEVICE_LIFECYCLE = 'DEVICE_LIFECYCLE',
    //   DEVICE_HEALTH = 'DEVICE_HEALTH',
    //   SECURITY_ARM_STATE = 'SECURITY_ARM_STATE',
    //   HUB_HEALTH = 'HUB_HEALTH',
    //   SCENE_LIFECYCLE = 'SCENE_LIFECYCLE',
    // }
    smartThingsClient.setLocation(locationId);
    smartThingsClient.subscriptions.installedAppId(appId);
    const subscription = await smartThingsClient.subscriptions.create(
      {
        sourceType: SubscriptionSource.CAPABILITY,
        capability: {
          locationId,
          capability,
          attribute: '*',
          value: '*',
        },
      },
      appId,
    );
    return subscription;
  }

  /**
   * AccessToken으로 SmartThings 제어를 위한 Client
   * @param accessToken
   * @param refreshData
   * @returns SmartThingsClient
   */
  getSmartThingsClientByAccessToken(
    accessToken: string,
    refreshData: RefreshData,
  ): SmartThingsClient {
    return new SmartThingsClient(
      new RefreshTokenAuthenticator(accessToken, new TokenStore(refreshData)),
      {
        logger: new SmartThinsLogger('trace'),
      },
    );
  }
}
