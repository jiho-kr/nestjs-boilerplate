import { ApiHeader } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ApiHeaderPat = () =>
  ApiHeader({
    name: 'personal-access-token',
    description: 'Personal Access Token',
  });
