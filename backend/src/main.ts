import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { logger } from '@/logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/core/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/core/filters/exception.filter';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '@/core/swagger/api-envelope.dto';
import {
  CategoryDto,
  ProductDto,
  StockDto,
  TotalsByUnitDto,
  UnitDto,
} from '@/core/swagger/resource.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Metis API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [
      ApiErrorResponseDto,
      ApiSuccessResponseDto,
      CategoryDto,
      ProductDto,
      StockDto,
      TotalsByUnitDto,
      UnitDto,
    ],
  });

  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.BACKEND_PORT) || 9000;
  await app.listen(port);

  console.log(`Metis API running on port: ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}
void bootstrap();
