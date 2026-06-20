import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global() // Делаем модуль глобальным, чтобы не импортировать его в каждый модуль
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
