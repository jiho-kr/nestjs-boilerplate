import { RpcException } from '@nestjs/microservices';

export class SqsValidationError extends RpcException {
  constructor() {
    super(SqsValidationError.name);
  }
}
