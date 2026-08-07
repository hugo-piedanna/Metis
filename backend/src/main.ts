import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { logger } from '@/logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@/core/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/core/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(9000);

  console.log('Metis API running on port:', 9000);
}
bootstrap();
