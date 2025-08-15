import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { Logger } from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: process.env.ENV !== 'production',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
