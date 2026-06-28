import { Module, forwardRef } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from './inventory.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../products/product.module';
import { WarehouseModule } from '../warehouses/warehouse.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ProductModule),
    forwardRef(() => WarehouseModule),
  ],
  providers: [InventoryService, InventoryRepository],
  exports: [InventoryService, InventoryRepository],
})
export class InventoryModule {}
