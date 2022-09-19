import { ApiParam } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ApiParamAppId = () =>
  ApiParam({
    name: 'appId',
    type: String,
    description: 'App ID',
    required: true,
  });
