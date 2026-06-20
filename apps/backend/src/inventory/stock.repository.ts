import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockItem } from '@prisma/client';
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

  async findAll(filters: StockFilter): Promise<StockItem[]> {
    const where: any = {};
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.productId) where.productId = filters.productId;
    if (filters.lowStock) {
      where.AND = [{ quantity: { lte: this.prisma.stockItem.fields.minStock } }];
    }

    return this.prisma.stockItem.findMany({
      where,
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { updatedAt: 'desc' },
      include: { product: { include: { category: true } }, warehouse: true },
    });
  }

  async findItem(productId: string, warehouseId: string): Promise<StockItem | null> {
    return this.prisma.stockItem.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
      include: { product: true, warehouse: true },
    });
  }

  async adjustQuantity(productId: string, warehouseId: string, delta: number): Promise<StockItem> {
    const existing = await this.findItem(productId, warehouseId);
    if (existing) {
      return this.prisma.stockItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + delta },
      });
    }
    return this.prisma.stockItem.create({
      data: { id: uuidv7(), productId, warehouseId, quantity: delta, minStock: 0, maxStock: 0 },
    });
  }

  async countLowStock(): Promise<number> {
    const items = await this.prisma.stockItem.findMany({
      where: { quantity: { lte: this.prisma.stockItem.fields.minStock } },
    });
    return items.length;
  }
}
