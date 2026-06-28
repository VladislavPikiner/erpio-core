import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionRepository } from '../transaction.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Transaction } from '@prisma/client';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      $transaction: vi.fn(),
      transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
      account: {
        update: vi.fn(),
      },
    } as unknown as PrismaService;

    repository = new TransactionRepository(prismaService);
  });

  describe('create', () => {
    it('should create transaction and update account balance (DEBIT)', async () => {
      const data = { accountId: 'acc-1', type: 'DEBIT' as const, amount: 100, description: 'Test' };
      const mockTransaction = { id: 'tx-1', ...data } as Transaction;
      const mockAccountUpdate = { id: 'acc-1', balance: 1100 };

      // Мокаем внутренние методы, чтобы они не возвращали undefined
      vi.mocked(prismaService.transaction.create).mockResolvedValue(mockTransaction);
      vi.mocked(prismaService.account.update).mockResolvedValue(mockAccountUpdate as any);
      
      // Мокаем сам $transaction, чтобы он возвращал массив результатов
      vi.mocked(prismaService.$transaction).mockResolvedValue([mockTransaction, mockAccountUpdate]);

      const result = await repository.create(data);

      expect(result).toEqual(mockTransaction);
      
      // Проверяем, что конкретные операции были вызваны с правильными данными
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accountId: 'acc-1',
          type: 'DEBIT',
          amount: 100,
          notes: 'Test',
        }),
      });

      expect(prismaService.account.update).toHaveBeenCalledWith({
        where: { id: 'acc-1' },
        data: { balance: { increment: 100 } },
      });
    });
  });

  describe('findAll', () => {
    it('should find transactions for a specific account', async () => {
      const mockTransactions: Partial<Transaction>[] = [
        { id: 'tx-1', accountId: 'acc-1', amount: 100 },
      ];
      vi.mocked(prismaService.transaction.findMany).mockResolvedValue(mockTransactions as Transaction[]);

      const result = await repository.findAll('acc-1');

      expect(result).toEqual(mockTransactions);
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: { accountId: 'acc-1' },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { account: true },
      });
    });
  });
});
