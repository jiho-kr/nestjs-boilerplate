import type { Type } from '@nestjs/common';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const ResponseList = <TModel extends Type<unknown>>(
  model: TModel,
  status = HttpStatus.OK,
) =>
  applyDecorators(
    HttpCode(status),
    ApiOkResponse({
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
              data: {
                type: 'object',
                properties: {
                  total: {
                    type: 'number',
                    example: 0,
                  },
                  list: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
