import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not defined in dto
      forbidNonWhitelisted: true, // send error when other properties sent
      transform: true, // convert primitives
    }),
  );
  await app.listen(3000);
}
bootstrap();
