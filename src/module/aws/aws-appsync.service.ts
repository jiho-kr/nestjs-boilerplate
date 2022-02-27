import 'isomorphic-fetch';

import { Injectable, Logger } from '@nestjs/common';
import type { NormalizedCacheObject } from 'apollo-cache-inmemory';
import type { FetchResult } from 'apollo-link';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import AWS from 'aws-sdk';
import { gql } from 'graphql-tag';

import { ErrorMessageProvider } from '../../provider/error-message.provider';
import { EnvironmentService } from '../environment/environment.service';

@Injectable()
export class AwsAppSyncService {
  constructor(private readonly environmentService: EnvironmentService) {}

  async updatedSpacesState(
    propertyId: number,
    spaceIds: number[],
    version = 'v1',
  ): Promise<
    FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>
  > {
    const mutation = gql`
      mutation xx...
    `;

    try {
      const client = await this.getClient();
      const result = await client.mutate({
        mutation,
        variables: {
          version,
          globalPropertyId: propertyId,
          spaceIds,
        },
      });
      if (!this.environmentService.isProduction()) {
        Logger.log(JSON.stringify(result), 'AWSAppSync [updatedSpacesState]');
      }
      return result;
    } catch (error) {
      ErrorMessageProvider.awsAppsyncException(error, {
        method: 'updatedSpacesState',
      });
    }
  }

  private async getClient(): Promise<AWSAppSyncClient<NormalizedCacheObject>> {
    const credentials = this.environmentService.isLocal()
      ? AWS.config.credentials
      : await new AWS.CredentialProviderChain([
          () => new AWS.EC2MetadataCredentials(),
          () => new AWS.SharedIniFileCredentials(),
        ]).resolvePromise();

    const appSyncClient = new AWSAppSyncClient({
      url: this.environmentService.get<string>('AWS_APPSYNC_ENDPOINT'),
      region: this.environmentService.get<string>('AWS_REGION'),
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials,
      },
      disableOffline: true,
    });
    const client = await appSyncClient.hydrated();
    return client;
  }
}
