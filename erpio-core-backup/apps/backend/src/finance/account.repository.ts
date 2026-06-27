import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Account[]> {
    return this.prisma.account.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async create(data: { name: string; type: string; currency?: string; isActive?: boolean }): Promise<Account> {
    return this.prisma.account.create({
      data: { id: uuidv7(), ...data as any },
    });
  }

  async update(id: string, data: { name?: string; type?: string; currency?: string; isActive?: boolean }): Promise<Account> {
    return this.prisma.account.update({ where: { id }, data: data as any });
  }

  async updateBalance(id: string, increment: number): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: { balance: { increment } },
    });
  }
}
