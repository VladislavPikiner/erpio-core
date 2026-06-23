import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Response } from 'express';

/**
 * Глобальный фильтр исключений.
 *
 * Ловит все необработанные ошибки и возвращает клиенту
 * единообразный JSON-ответ `{ success: false, error: { status, message, path, timestamp } }`.
 *
 * - HttpException → читаемый статус и сообщение
 * - Внутренние ошибки → 500, логгируются отдельно
 */
@Catch()
export class GlobalExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<any>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody) {
        errorMessage = (responseBody as any).message;
      } else {
        errorMessage = responseBody as string;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Sentry.captureException(exception);
      this.logger.error(`Unhandled exception: ${JSON.stringify(exception)}`, request.url);
    }

    response.status(status).json({
      success: false,
      error: {
        status,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
