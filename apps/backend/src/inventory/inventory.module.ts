import { Module } from '@nestjs/common';
import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { WarehouseRepository } from './warehouse.repository';
import { StockRepository } from './stock.repository';
import { StockMovementRepository } from './stock-movement.repository';

@Module({
  providers: [
    InventoryResolver,
    InventoryService,
    WarehouseRepository,
    StockRepository,
    StockMovementRepository,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
