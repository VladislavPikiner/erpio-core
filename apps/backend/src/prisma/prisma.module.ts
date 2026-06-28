import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делаем модуль глобальным
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
