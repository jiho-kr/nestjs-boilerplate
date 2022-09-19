import { ApiParam } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ApiParamDeviceId = () =>
  ApiParam({
    name: 'deviceId',
    type: String,
    description: 'Device ID',
    required: true,
  });
