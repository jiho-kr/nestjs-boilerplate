import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { description, name, version } from '../package.json';
import { AuthorizationToken } from './constant/authorization-token';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(description)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'xxxxxxxx',
        in: 'header',
      },
      AuthorizationToken.GrmsPms,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
}
