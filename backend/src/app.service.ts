import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  private readonly SERVICE_NAME = AppService.name;
  private readonly logger = new Logger(this.SERVICE_NAME);

  getHello(): string {
    this.logger.log('Hello World! method called');
    return 'Hello World!';
  }
}
