import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleRepository } from './sale.repository';
import { SaleResolver } from './sale.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { WarehouseModule } from '../warehouses/warehouse.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    PrismaModule,
    WarehouseModule,
    InventoryModule,
  ],
  providers: [
    SaleService,
    SaleRepository,
    SaleResolver,
  ],
  exports: [SaleService, SaleRepository],
})
export class SaleModule {}
