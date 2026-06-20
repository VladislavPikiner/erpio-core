import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sale } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';
import { CreateSaleItemData, computeSubtotal } from './sale-item.repository';

/** Данные для создания продажи (включая список товаров). */
interface CreateSaleData {
  customerId?: string | null;
  discount: number;
  notes?: string | null;
  items: CreateSaleItemData[];
}

/** Фильтры для списка продаж. */
interface SaleFilter {
  search?: string;
  status?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  skip?: number;
  take?: number;
}

/** Дефолтное включение связанных сущностей. */
const SALE_INCLUDE = {
  customer: true,
  items: { include: { product: { include: { category: true } } } },
  payments: true,
} as const;

/** Построитель Prisma-фильтра для SaleFilter. */
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
      {
        customer: { name: { contains: filters.search, mode: 'insensitive' } },
      },
    ];
  }
  return where;
}

/**
 * Репозиторий продаж.
 *
 * - Автогенерация номера ORD-YYYYMMDD-NNNNNN
 * - Расчёт subtotal/total на основе позиций
 * - Создание SaleItem как вложенный create
 */
@Injectable()
export class SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Сгенерировать следующий номер продажи. */
  async generateNumber(): Promise<string> {
    const today = new Date();
    const prefix = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-`;

    const last = await this.prisma.sale.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
    });

    const nextNum = last ? parseInt(last.number.slice(-6), 10) + 1 : 1;
    return `${prefix}${String(nextNum).padStart(6, '0')}`;
  }

  /** Список продаж с фильтрацией. */
  async findAll(filters: SaleFilter): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: buildSaleFilter(filters),
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { date: 'desc' },
      include: SALE_INCLUDE,
    });
  }

  /** Найти продажу по id (с include). */
  async findById(id: string): Promise<Sale | null> {
    return this.prisma.sale.findUnique({ where: { id }, include: SALE_INCLUDE });
  }

  /**
   * Создать продажу.
   * - Генерирует номер
   * - Считает subtotal (сумма товаров) и total (subtotal - discount)
   * - Создаёт связанные SaleItem через nested create
   */
  async create(data: CreateSaleData): Promise<Sale> {
    const number = await this.generateNumber();
    const subtotal = computeSubtotal(data.items);
    const total = subtotal - data.discount;

    return this.prisma.sale.create({
      data: {
        id: uuidv7(),
        number,
        customerId: data.customerId ?? null,
        discount: data.discount,
        subtotal,
        total,
        notes: data.notes ?? null,
        status: 'CONFIRMED',
        items: {
          create: data.items.map((i) => ({
            id: uuidv7(),
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

  /** Обновить статус продажи. */
  async updateStatus(id: string, status: string): Promise<Sale> {
    return this.prisma.sale.update({
      where: { id },
      data: { status: status as any },
      include: SALE_INCLUDE,
    });
  }

  /** Количество продаж по фильтру. */
  async count(filters: Partial<SaleFilter>): Promise<number> {
    return this.prisma.sale.count({ where: buildSaleFilter(filters) });
  }
}
