import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

interface StockFilter {
  warehouseId?: string;
  productId?: string;
  lowStock?: boolean;
  skip?: number;
  take?: number;
}

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: StockFilter): Promise<Inventory[]> {
    const where: any = {};
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.productId) where.productId = filters.productId;
    if (filters.lowStock) {
      where.AND = [{ quantity: { lte: this.prisma.inventory.fields.reorderLevel } }];
    }

    return this.prisma.inventory.findMany({
      where,
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { updatedAt: 'desc' },
      include: { product: { include: { category: true } }, warehouse: true },
    });
  }

  async findItem(productId: string, warehouseId: string): Promise<Inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
      include: { product: true, warehouse: true },
    });
  }

  async adjustQuantity(productId: string, warehouseId: string, delta: number): Promise<Inventory> {
    const existing = await this.findItem(productId, warehouseId);
    if (existing) {
      return this.prisma.inventory.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + delta },
      });
    }
    return this.prisma.inventory.create({
      data: { id: uuidv7(), productId, warehouseId, quantity: delta, reorderLevel: 0 },
    });
  }

  async countLowStock(): Promise<number> {
    const items = await this.prisma.inventory.findMany({
      where: { quantity: { lte: this.prisma.inventory.fields.reorderLevel } },
    });
    return items.length;
  }
}
