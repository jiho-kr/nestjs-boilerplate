import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { MessageDto } from '../message.dto';

describe('MessageDto', () => {
  it('default values', async () => {
    const value = {
      lifecycle: 'CONFIRMATION',
      executionId: '5BBA76A1-E8CB-41D8-9DDD-F407067B124D',
      appId: '2855a931-d258-4ac7-b293-c56ad2145d51',
      locale: 'en',
      version: '0.1.0',
      confirmationData: {
        appId: '2855a931-d258-4ac7-b293-c56ad2145d51',
        confirmationUrl:
          'https://api.smartthings.com/apps/2855a931-d258-4ac7-b293-c56ad2145d51/confirm-registration?token=175bc862-4ec2-4011-9ce6-9fc433736348',
      },
      settings: {},
    };
    const object = plainToClass(MessageDto, value);
    const validateResult = await validate(object);
    expect(validateResult.length).toEqual(0);
  });
});
