import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovement } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';
import { CreateStockMovementDto } from './inventory.schema';

@Injectable()
export class StockMovementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: z.infer<typeof CreateStockMovementDto> & { userId?: string }): Promise<StockMovement> {
    // В схеме StockMovement нет полей userId, productId и warehouseId.
    // Все данные о продукте и складе содержатся в связанном Inventory.
    
    const quantity = (data.type === 'OUT' || data.type === 'TRANSFER_OUT')
      ? -Math.abs(data.quantity)
      : Math.abs(data.quantity);

    return this.prisma.stockMovement.create({
      data: {
        id: uuidv7(),
        inventoryId: data.inventoryId, // используем inventoryId из DTO
        quantity,
        type: data.type,
        reference: data.referenceType ? `${data.referenceType}:${data.referenceId}` : null,
        notes: data.notes ?? null,
      },
      include: { 
        inventory: { 
          include: { 
            product: true, 
            warehouse: true 
          } 
        } 
      },
    });
  }

  async findAll(productId?: string, warehouseId?: string, limit = 50): Promise<StockMovement[]> {
    const where: any = {};
    
    if (productId || warehouseId) {
      where.inventory = {
        productId: productId,
        warehouseId: warehouseId,
      };
    }

    return this.prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { 
        inventory: { 
          include: { 
            product: true, 
            warehouse: true 
          } 
        } 
      },
    });
  }
}
