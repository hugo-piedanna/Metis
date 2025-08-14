import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.INTERNAL_API_PORT);

  console.log('Metis API running on port:', process.env.INTERNAL_API_PORT);
}
bootstrap();
