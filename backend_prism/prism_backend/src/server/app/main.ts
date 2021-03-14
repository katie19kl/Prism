import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  let port = 4000
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow communication with the front-end app.
  await app.listen(port);
}
bootstrap();