import type { CanActivate } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { EnvironmentService } from '../module/environment/environment.service';

@Injectable()
export class OnlyDevelopment implements CanActivate {
  constructor(private readonly environmentService: EnvironmentService) {}

  canActivate(): boolean {
    return !this.environmentService.isProduction();
  }
}
