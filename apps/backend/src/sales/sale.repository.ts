import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Sale } from '@prisma/client';
import { CreateSaleItemData, computeSubtotal } from './sale-item.repository';

interface CreateSaleData {
  customerId?: string | null;
  discount: number;
  notes?: string | null;
  items: CreateSaleItemData[];
}

interface SaleFilter {
  search?: string;
  status?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  skip?: number;
  take?: number;
}

const SALE_INCLUDE = {
  customer: true,
  items: { include: { product: { include: { category: true } } } },
  payments: true,
} as const;

function buildSaleFilter(filters: Partial<SaleFilter>): any {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.dateFrom || filters.dateTo) {
    where.date = {};
    if (filters.dateFrom) where.date.gte = filters.dateFrom;
    if (filters.dateTo) where.date.lte = filters.dateTo;
  }
  if (filters.search) {
    where.OR = [
      { number: { contains: filters.search } },
      { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }
  return where;
}

@Injectable()
export class SaleRepository extends BaseRepository<Sale> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.sale);
  }

  async generateNumber(): Promise<string> {
    const today = new Date();
    const prefix = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-`;

    const last = await this.model.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
    });

    const nextNum = last ? parseInt(last.number.slice(-6), 10) + 1 : 1;
    return `${prefix}${String(nextNum).padStart(6, '0')}`;
  }

  async findAll(filters: SaleFilter): Promise<Sale[]> {
    return this.model.findMany({
      where: buildSaleFilter(filters),
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { date: 'desc' },
      include: SALE_INCLUDE,
    });
  }

  async findById(id: string): Promise<Sale | null> {
    return this.model.findUnique({ where: { id }, include: SALE_INCLUDE });
  }

  async create(data: CreateSaleData): Promise<Sale> {
    const number = await this.generateNumber();
    const subtotal = computeSubtotal(data.items);
    const total = subtotal - data.discount;

    return this.model.create({
      data: {
        number,
        customerId: data.customerId ?? null,
        discount: data.discount,
        subtotal,
        total,
        notes: data.notes ?? null,
        status: 'CONFIRMED',
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            discount: i.discount ?? 0,
            total: i.unitPrice * i.quantity - (i.discount ?? 0),
          })),
        },
      },
      include: SALE_INCLUDE,
    });
  }

  async updateStatus(id: string, status: string): Promise<Sale> {
    return this.model.update({
      where: { id },
      data: { status: status as any },
      include: SALE_INCLUDE,
    });
  }

  async count(filters: Partial<SaleFilter>): Promise<number> {
    return this.model.count({ where: buildSaleFilter(filters) });
  }
}
