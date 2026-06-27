import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory } from '@prisma/client';
import { AdjustStockDto } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Получить остатки товара на складе */
  async getStock(productId: string, warehouseId: string): Promise<Inventory | null> {
    return this.prisma.inventory.findFirst({
      where: { productId, warehouseId },
    });
  }

  /** Атомарное изменение остатков */
  async adjustStock(warehouseId: string, data: AdjustStockDto): Promise<Inventory> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Находим или создаем запись инвентаря
      let inventory = await tx.inventory.findFirst({
        where: { productId: data.productId, warehouseId },
      });

      if (!inventory) {
        inventory = await tx.inventory.create({
          data: {
            productId: data.productId,
            warehouseId,
            quantity: 0,
          },
        });
      }

      // 2. Проверка: не уходим ли в минус (если списываем)
      if (inventory.quantity + data.quantity < 0) {
        throw new BadRequestException('Insufficient stock');
      }

      // 3. Обновляем количество
      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: { increment: data.quantity } },
      });

      // 4. Создаем движение товара
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          quantity: data.quantity,
          type: data.type,
          notes: data.notes,
        },
      });

      return updatedInventory;
    });
  }
}
