import {
  BearerTokenAuthenticator,
  SmartThingsClient,
} from '@smartthings/core-sdk';

export class SmartThingsProvider {
  private smartThingsClient: SmartThingsClient;
  private smartThingsAppName: string;

  constructor(personalAccessToken: string, env: string) {
    this.smartThingsClient = new SmartThingsClient(
      new BearerTokenAuthenticator(personalAccessToken),
    );
    this.smartThingsAppName = `GRMS-SMART-THINGS-${env}`;
  }

  static get Provide(): string {
    return 'SMART-THINGS-CLIENT';
  }

  get appName(): string {
    return this.smartThingsAppName;
  }

  get client(): SmartThingsClient {
    return this.smartThingsClient;
  }
}
