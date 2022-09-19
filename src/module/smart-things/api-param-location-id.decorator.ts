import { ApiParam } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ApiParamLocationId = () =>
  ApiParam({
    name: 'locationId',
    type: String,
    description: 'Location ID',
    required: true,
  });
