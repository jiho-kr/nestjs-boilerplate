import type { ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Catch(RpcException)
export class SqsExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, _host: ArgumentsHost): Observable<unknown> {
    return throwError(() => exception.getError());
  }
}
