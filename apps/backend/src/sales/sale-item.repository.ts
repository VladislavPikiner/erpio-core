import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { uuidv7 } from '../common/utils/uuid';

export interface CreateSaleItemData {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export function computeItemTotal(item: CreateSaleItemData): number {
  return item.unitPrice * item.quantity - (item.discount ?? 0);
}

export function computeSubtotal(items: CreateSaleItemData[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

@Injectable()
export class SaleItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(saleId: string, items: CreateSaleItemData[]) {
    return this.prisma.saleItem.createMany({
      data: items.map((i) => ({
        id: uuidv7(),
        saleId,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discount ?? 0,
        total: computeItemTotal(i),
      })),
    });
  }

  findBySaleId(saleId: string, includeProduct = false) {
    return this.prisma.saleItem.findMany({
      where: { saleId },
      include: includeProduct ? { product: { include: { category: true } } } : undefined,
    });
  }
}
