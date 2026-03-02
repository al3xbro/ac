import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      https: {
        key: readFileSync(
          '/etc/letsencrypt/live/alexserver.sytes.net/privkey.pem',
        ),
        cert: readFileSync(
          '/etc/letsencrypt/live/alexserver.sytes.net/fullchain.pem',
        ),
      },
    }),
    {
      bufferLogs: true,
    },
  );

  app.enableCors();
  app.setGlobalPrefix('ac');

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
