import { Module } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferRepository } from './stock-transfer.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { WarehouseModule } from '../warehouses/warehouse.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [PrismaModule, InventoryModule, WarehouseModule, ProductModule],
  providers: [StockTransferService, StockTransferRepository],
  exports: [StockTransferService, StockTransferRepository],
})
export class StockTransferModule {}
