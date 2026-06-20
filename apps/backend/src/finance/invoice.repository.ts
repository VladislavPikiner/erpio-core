import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invoice } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

interface CreateInvoiceData {
  customerId?: string | null;
  dueDate: Date;
  subtotal: number;
  tax: number;
  notes?: string | null;
}

interface InvoiceFilter {
  customerId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  skip?: number;
  take?: number;
}

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateNumber(): Promise<string> {
    const prefix = `INV-${new Date().getFullYear()}-`;
    const last = await this.prisma.invoice.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
    });
    const nextNum = last ? parseInt(last.number.split('-')[2], 10) + 1 : 1;
    return `${prefix}${String(nextNum).padStart(5, '0')}`;
  }

  async findAll(filters: InvoiceFilter): Promise<Invoice[]> {
    const where: any = {};
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    return this.prisma.invoice.findMany({
      where,
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { date: 'desc' },
      include: { customer: true },
    });
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });
  }

  async create(data: CreateInvoiceData): Promise<Invoice> {
    const number = await this.generateNumber();
    return this.prisma.invoice.create({
      data: {
        id: uuidv7(),
        number,
        customerId: data.customerId ?? null,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.subtotal + data.tax,
        notes: data.notes ?? null,
        status: 'DRAFT',
      },
      include: { customer: true },
    });
  }

  async updateStatus(id: string, status: string): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: status as any },
      include: { customer: true },
    });
  }

  async count(filters: Partial<InvoiceFilter>): Promise<number> {
    const where: any = {};
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }
    return this.prisma.invoice.count({ where });
  }
}
