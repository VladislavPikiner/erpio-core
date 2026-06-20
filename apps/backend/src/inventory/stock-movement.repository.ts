import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovement } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';
import { CreateStockMovementDto } from './inventory.schema';

@Injectable()
export class StockMovementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStockMovementDto & { userId?: string }): Promise<StockMovement> {
    const quantity = data.type === 'OUT' || data.type === 'TRANSFER'
      ? -Math.abs(data.quantity)
      : Math.abs(data.quantity);

    return this.prisma.stockMovement.create({
      data: {
        id: uuidv7(),
        productId: data.productId,
        warehouseId: data.warehouseId,
        type: data.type as any,
        quantity,
        reference: data.reference ?? null,
        notes: data.notes ?? null,
        userId: data.userId ?? null,
      },
      include: { product: true, warehouse: true },
    });
  }

  async findAll(productId?: string, warehouseId?: string, limit = 50): Promise<StockMovement[]> {
    const where: any = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    return this.prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { product: true, warehouse: true },
    });
  }
}
