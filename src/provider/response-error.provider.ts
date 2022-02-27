import { HttpException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

export class ResponseErrorProvider {
  static convertError(err: unknown): void {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as Record<string, unknown>;
      const message = data.message as string;
      throw new HttpException(message, status);
    }
    if (err instanceof HttpException) {
      throw err;
    }
    if (err instanceof Error) {
      throw new InternalServerErrorException(err.message);
    }
    throw err;
  }
}
