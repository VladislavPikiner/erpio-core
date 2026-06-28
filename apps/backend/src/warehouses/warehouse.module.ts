import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WarehouseService, WarehouseRepository],
  exports: [WarehouseService, WarehouseRepository],
})
export class WarehouseModule {}
