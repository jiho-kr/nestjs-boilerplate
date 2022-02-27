import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthSpaceDetail = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.spaceDetailDto;
  },
);
