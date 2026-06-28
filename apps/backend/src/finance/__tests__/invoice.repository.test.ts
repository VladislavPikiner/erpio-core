import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvoiceRepository } from '../invoice.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Invoice } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('InvoiceRepository', () => {
  let repository: InvoiceRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      invoice: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
    } as unknown as PrismaService;

    repository = new InvoiceRepository(prismaService);
  });

  describe('generateNumber', () => {
    it('should generate first invoice number if none exist', async () => {
      vi.spyOn(repository['model'], 'findFirst').mockResolvedValue(null);
      
      const number = await repository.generateNumber();
      const currentYear = new Date().getFullYear();
      expect(number).toBe(`INV-${currentYear}-00001`);
    });

    it('should increment invoice number based on the last one', async () => {
      const lastInvoice = { number: `INV-${new Date().getFullYear()}-00010` } as Invoice;
      vi.spyOn(repository['model'], 'findFirst').mockResolvedValue(lastInvoice);
      
      const number = await repository.generateNumber();
      expect(number).toBe(`INV-${new Date().getFullYear()}-00011`);
    });
  });

  describe('findById', () => {
    it('should return invoice if found', async () => {
      const mockInvoice = { id: 'inv-1', number: 'INV-2026-00001' } as Invoice;
      vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(mockInvoice);

      const result = await repository.findById('inv-1');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException if invoice not found', async () => {
      vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(null);
      await expect(repository.findById('inv-unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create invoice with generated number and calculated total', async () => {
      const createData = {
        customerId: 'cust-1',
        dueDate: new Date(),
        subtotal: 100,
        tax: 20,
        notes: 'Test note',
      };
      const mockInvoice = { ...createData, id: 'inv-new', total: 120, status: 'DRAFT' } as Invoice;
      
      vi.spyOn(repository, 'generateNumber').mockResolvedValue('INV-2026-00001');
      vi.spyOn(repository['model'], 'create').mockResolvedValue(mockInvoice);

      const result = await repository.create(createData);

      expect(result).toEqual(mockInvoice);
      expect(prismaService.invoice.create).toHaveBeenCalledWith({
        data: {
          number: 'INV-2026-00001',
          customerId: 'cust-1',
          dueDate: createData.dueDate,
          subtotal: 100,
          tax: 20,
          total: 120,
          notes: 'Test note',
          status: 'DRAFT',
        },
        include: { customer: true },
      });
    });
  });

  describe('count', () => {
    it('should apply customer and status filters', async () => {
      const filters = { customerId: 'cust-1', status: 'PAID' };
      vi.spyOn(repository['model'], 'count').mockResolvedValue(5);

      const result = await repository.count(filters);

      expect(result).toBe(5);
      expect(prismaService.invoice.count).toHaveBeenCalledWith({
        where: { customerId: 'cust-1', status: 'PAID' },
      });
    });

    it('should apply date range filters', async () => {
      const dateFrom = new Date('2026-01-01');
      const dateTo = new Date('2026-01-31');
      const filters = { dateFrom, dateTo };
      vi.spyOn(repository['model'], 'count').mockResolvedValue(2);

      const result = await repository.count(filters);

      expect(result).toBe(2);
      expect(prismaService.invoice.count).toHaveBeenCalledWith({
        where: {
          date: { gte: dateFrom, lte: dateTo },
        },
      });
    });
  });
});
