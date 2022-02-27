import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { EnvironmentKey } from './environment.validation';
import { NodeEnvironment } from './environment.validation';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: EnvironmentKey): T {
    return this.configService.get<T>(key);
  }

  isLocal(): boolean {
    return this.get<string>('ENV') === NodeEnvironment.Local;
  }

  isProduction(): boolean {
    return this.get<string>('ENV') === NodeEnvironment.Production;
  }
}
