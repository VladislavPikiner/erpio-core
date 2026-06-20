import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

interface CreateTransactionData {
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
}

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<Transaction> {
    const balanceChange = data.type === 'DEBIT' ? data.amount : -data.amount;

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          id: uuidv7(),
          accountId: data.accountId,
          type: data.type,
          amount: data.amount,
          description: data.description ?? null,
          referenceType: data.referenceType ?? null,
          referenceId: data.referenceId ?? null,
        },
      }),
      this.prisma.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: balanceChange } },
      }),
    ]);

    return transaction;
  }

  async findAll(accountId?: string, limit = 50): Promise<Transaction[]> {
    const where: any = {};
    if (accountId) where.accountId = accountId;

    return this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      include: { account: true },
    });
  }
}
