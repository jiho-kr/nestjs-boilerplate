/* eslint-disable @typescript-eslint/ban-types */
import type {
  ArgumentMetadata,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { SqsValidationError } from '../exception/validation.error';
import type { ISqsMessageAbstractDto } from '../microservice/aws-sqs/aws-sqs';
import { ErrorMessageProvider } from '../provider/error-message.provider';

@Injectable()
export class AwsSqsValidationPipe implements PipeTransform<unknown> {
  protected exceptionFactory: (errors: ValidationError[]) => unknown;

  async transform(
    value: ISqsMessageAbstractDto,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value.opts);
    const validationErrors = await validate(object);
    if (validationErrors.length > 0) {
      const error = new SqsValidationError();
      ErrorMessageProvider.sqsValidationException(
        error,
        value,
        validationErrors,
      );
      throw error;
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
