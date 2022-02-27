import requestContext from 'request-context';

import type { PropertyDto } from '../module/grms-service/dto/property.dto';

export class ContextProvider {
  private static readonly nameSpace = 'request';
  private static authPropertyKey = 'property_key';

  private static get<T>(key: string): T {
    return requestContext.get(ContextProvider.getKeyWithNamespace(key));
  }

  private static set(key: string, value: unknown): void {
    requestContext.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthProperty(propertyDto: PropertyDto): void {
    ContextProvider.set(ContextProvider.authPropertyKey, propertyDto);
  }

  static getAuthProperty(): PropertyDto {
    return ContextProvider.get(ContextProvider.authPropertyKey);
  }
}
