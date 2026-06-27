import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Invoice } from '@prisma/client';

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
export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.invoice);
  }

  async generateNumber(): Promise<string> {
    const prefix = `INV-${new Date().getFullYear()}-`;
    const last = await this.model.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
    });
    const nextNum = last ? parseInt(last.number.split('-')[2], 10) + 1 : 1;
    return `${prefix}${String(nextNum).padStart(5, '0')}`;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  } = {}): Promise<Invoice[]> {
    const { skip, take, where, orderBy } = params;
    return this.model.findMany({
      where,
      skip,
      take,
      orderBy: orderBy ?? { createdAt: 'desc' },
      include: { customer: true },
    });
  }

  async findById(id: string | number): Promise<Invoice> {
    const invoice = await this.model.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!invoice) throw new NotFoundException(`Invoice with ID ${id} not found`);
    return invoice;
  }

  async create(data: CreateInvoiceData): Promise<Invoice> {
    const number = await this.generateNumber();
    return this.model.create({
      data: {
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
    return this.model.update({
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
    return this.model.count({ where });
  }
}
