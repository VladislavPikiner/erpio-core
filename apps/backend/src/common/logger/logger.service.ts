import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

/**
 * Кастомный логгер на базе Winston.
 *
 * - В production → файлы `logs/error.log` и `logs/combined.log`
 * - В dev → цветной консольный вывод
 *
 * Реализует NestJS LoggerService для полной совместимости.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs/error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs/combined.log'),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      );
    }
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, { metadata: optionalParams });
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, { metadata: optionalParams });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, { metadata: optionalParams });
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, { metadata: optionalParams });
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, { metadata: optionalParams });
  }
}
