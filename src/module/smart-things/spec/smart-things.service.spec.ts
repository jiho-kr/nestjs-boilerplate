import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SmartThingsManagementService } from '../smart-things.management.service';
import { SmartThingsModule } from '../smart-things.module';

const SMART_THINGS_PAT = '6687987d-2dfb-4528-b68c-b943581bd5be';

describe('SmartThingsManagementService', () => {
  let service: SmartThingsManagementService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SmartThingsModule],
      controllers: [],
      providers: [],
    }).compile();

    service = app.get<SmartThingsManagementService>(
      SmartThingsManagementService,
    );
  });

  it('registerApp', async () => {
    const appCreationResponse = await service.registerApp(SMART_THINGS_PAT, {
      appName: `grms-${Date.now()}`,
      displayName: 'GRMS Test App',
      description: 'GRMS Test App',
    });
    console.log(appCreationResponse);
  });

  it.only('getApp', async () => {
    const [app] = await service.getAppList(SMART_THINGS_PAT);
    console.log(app);

    if (!app) {
      return;
    }
    const appResponse = await service.getApp(SMART_THINGS_PAT, app.appId);
    console.log(appResponse);

    // await service.deleteApp(app.appId);
  });

  it('authCode', async () => {
    const res = await service.redeemCode({
      clientId: '05b3a77d-7615-40b2-936a-b5325b73f070',
      clientSecret: '81fcb531-9883-425f-92f9-2708a897de71',
      authCode: 'GRMS-Auth-Code',
    });
    console.log(JSON.stringify(res, null, '\t'));
  });

  it('getLocationList', async () => {
    const locationList = await service.getLocationList(SMART_THINGS_PAT);
    console.log(locationList);
  });

  it('getDeviceList', async () => {
    const x = await service.getDeviceList(SMART_THINGS_PAT);
    console.log(JSON.stringify(x, null, '\t'));
  });

  test('get device command', async () => {
    const device = await service.getDevice(
      SMART_THINGS_PAT,
      'a1d27e89-5b28-f1ca-6342-a4279176d90e',
    );
    if (!device.components) {
      return;
    }
    console.log(JSON.stringify(device, null, '\t'));
    for (const component of device.components) {
      console.log(component.label);
      for (const capabilityInfo of component.capabilities) {
        console.log(capabilityInfo.id);
        const capability = await service.getCapability(
          SMART_THINGS_PAT,
          capabilityInfo.id,
          capabilityInfo.version ?? 0,
        );
        console.log(JSON.stringify(capability, null, '\t'));
      }
    }
  });

  test('create Subscription', async () => {
    // const smartThings = await service.getInformation();
    // smartThings[0].locationId
    const x = await service.createSubscription(
      service.getSmartThingsClientByAccessToken('accessToken', {
        refreshToken: 'refreshToken',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
      'appId',
    );
    console.log(x);
  });
});
