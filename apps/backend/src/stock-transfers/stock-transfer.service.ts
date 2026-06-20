import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateStockTransferDto } from './stock-transfer.schema';

@Injectable()
export class StockTransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(data: CreateStockTransferDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Списание со склада-отправителя
      await this.inventoryService.adjustStock(data.fromWarehouseId, {
        productId: data.productId,
        quantity: -data.quantity,
        type: 'TRANSFER_OUT',
        notes: `Transfer to ${data.toWarehouseId}`,
      });

      // 2. Зачисление на склад-получатель
      await this.inventoryService.adjustStock(data.toWarehouseId, {
        productId: data.productId,
        quantity: data.quantity,
        type: 'TRANSFER_IN',
        notes: `Transfer from ${data.fromWarehouseId}`,
      });

      // 3. Создание записи о перемещении
      return tx.stockTransfer.create({
        data: {
          productId: data.productId,
          fromWarehouseId: data.fromWarehouseId,
          toWarehouseId: data.toWarehouseId,
          quantity: data.quantity,
          status: 'COMPLETED',
        },
      });
    });
  }
}
