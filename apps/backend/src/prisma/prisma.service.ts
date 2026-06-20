import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Сервис Prisma — центральный point of access к базе данных.
 *
 * Заменяет `nestjs-prisma`: мы контролируем lifecycle сами.
 * Подключается к БД при старте модуля и логирует успех/ошибку.
 *
 * @example
 * constructor(private readonly prisma: PrismaService) {}
 * async findAll() { return this.prisma.user.findMany(); }
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }
}
