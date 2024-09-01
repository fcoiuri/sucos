import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontUrl = configService.get<string>('FRONT_URL');

  app.enableCors({
    origin: frontUrl,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
