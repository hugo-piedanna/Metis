import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import ResponseWriter from '@/utils/responseWriter.utils';
import { logger } from '@/logger/winston.logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unexpected error';
    const errors: Array<{
      code: string;
      type: 'critical' | 'informative' | 'warning';
    }> = [];

    const log_level = 'error';
    let log_message = '';
    let log_stack = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;

      if (exception instanceof BadRequestException) {
        const responseValue: any = exception.getResponse();
        const validationErrors = Array.isArray(responseValue)
          ? responseValue
          : responseValue['message'];

        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((err: string) => {
            const code = err.toUpperCase().replace(/\s+/g, '_');
            errors.push({ code, type: 'critical' });

            log_message = `[Validation] ${code} → ${err}`;
            log_stack = exception instanceof Error ? exception.stack : null;
          });
        }
      }

      log_message = `[${exception.name}] ${status} → ${message}`;
      log_stack = exception instanceof Error ? exception.stack : null;
    } else if (exception instanceof Error) {
      message = exception.message;
      errors.push({ code: 'INTERNAL_ERROR', type: 'critical' });

      log_message = `[Runtime] ${message}`;
      log_stack = exception.stack;
    }

    if (errors.length === 0) {
      errors.push({ code: String(status), type: 'critical' });
    }

    logger.error({
      level: log_level,
      message: log_message,
      stack: log_stack,
    });

    const errorResponse = new ResponseWriter()
      .writeMessage(message)
      .writeData(null)
      .addErrors(errors)
      .writeResponse();

    response.status(status).json(errorResponse);
  }
}
