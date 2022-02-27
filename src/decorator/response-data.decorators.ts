import type { Type } from '@nestjs/common';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ResponseData = <TModel extends Type<unknown>>(
  model: TModel,
  status = HttpStatus.OK,
) =>
  applyDecorators(
    HttpCode(status),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              statusCode: {
                type: 'number',
                example: '200',
              },
              message: {
                type: 'string',
                example: 'OK',
              },
              code: {
                type: 'string',
                example: 'SUCCESS',
              },
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
