import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';

import type { PropertyDto } from '../module/grms-service/dto/property.dto';
import { ContextProvider } from '../provider/context.provider';

@Injectable()
export class PropertyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    const propertyDto = <PropertyDto>request.user.propertyDto;
    ContextProvider.setAuthProperty(propertyDto);

    return next.handle();
  }
}
