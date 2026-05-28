import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // tambahkan prefix api
  app.setGlobalPrefix('api');

  // aktifkan CORS untuk komunikasi frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // jalankan server berdasarkan env
  await app.listen(process.env.PORT!);
}

void bootstrap();
