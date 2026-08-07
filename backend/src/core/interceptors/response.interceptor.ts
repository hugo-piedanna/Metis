import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import ResponseWriter from '@/utils/responseWriter.utils';
import { logger } from '@/logger/winston.logger';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data: any) => {
        const message =
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
            ? data.message
            : 'Success';
        const payload =
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
            ? data.data
            : data;

        logger.log({
          level: 'info',
          message: `[${request.method}] ${request.url} → ${message}`,
          data: payload,
        });

        return new ResponseWriter<T>()
          .writeMessage(message)
          .writeData(payload)
          .writeResponse();
      }),
    );
  }
}
