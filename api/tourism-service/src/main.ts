import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // tambahkan prefix api
  app.setGlobalPrefix('api');

  // jalankan server berdasarkan env
  await app.listen(process.env.PORT!);
}

void bootstrap();
