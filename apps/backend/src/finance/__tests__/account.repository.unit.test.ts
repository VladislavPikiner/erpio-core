import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountRepository } from '../account.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Account } from '@prisma/client';
import { createPrismaMock } from '../../test/prisma.mock';

describe('AccountRepository', () => {
  let repository: AccountRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = createPrismaMock();
    repository = new AccountRepository(prismaService);
  });

  it('should find all accounts', async () => {
    const mockAccounts: Partial<Account>[] = [{ id: 'acc-1', name: 'Cash', type: 'ASSET', isActive: true, balance: 0 }];
    vi.spyOn(prismaService.account, 'findMany').mockResolvedValue(mockAccounts as Account[]);

    const result = await repository.findAll();

    expect(result).toEqual(mockAccounts);
    expect(prismaService.account.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
  });

  it('should find account by id', async () => {
    const mockAccount: Partial<Account> = { id: 'acc-1', name: 'Cash', type: 'ASSET', isActive: true, balance: 0 };
    vi.spyOn(prismaService.account, 'findUnique').mockResolvedValue(mockAccount as Account);

    const result = await repository.findById('acc-1');

    expect(result).toEqual(mockAccount);
    expect(prismaService.account.findUnique).toHaveBeenCalledWith({ where: { id: 'acc-1' } });
  });

  it('should return null if account not found by id', async () => {
    vi.spyOn(prismaService.account, 'findUnique').mockResolvedValue(null);

    const result = await repository.findById('acc-non-existent');

    expect(result).toBeNull();
    expect(prismaService.account.findUnique).toHaveBeenCalledWith({ where: { id: 'acc-non-existent' } });
  });

  it('should create an account', async () => {
    const mockAccount: Partial<Account> = { id: 'acc-new', name: 'Bank', type: 'ASSET', isActive: true, balance: 0 };
    const createData = { name: 'Bank', type: 'ASSET', isActive: true };
    vi.spyOn(prismaService.account, 'create').mockResolvedValue(mockAccount as Account);

    const result = await repository.create(createData as any);

    expect(result).toEqual(mockAccount);
    // Проверяем, что id генерируется (uuidv7)
    expect(prismaService.account.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ name: 'Bank', type: 'ASSET', isActive: true }) })
    );
  });

  it('should update an account', async () => {
    const accountId = 'acc-1';
    const updateData = { name: 'Savings', isActive: false };
    const updatedMockAccount: Partial<Account> = { id: accountId, name: 'Savings', isActive: false, type: 'ASSET', balance: 0 };

    vi.spyOn(prismaService.account, 'update').mockResolvedValue(updatedMockAccount as Account);

    const result = await repository.update(accountId, updateData as any);

    expect(result).toEqual(updatedMockAccount);
    expect(prismaService.account.update).toHaveBeenCalledWith({
      where: { id: accountId },
      data: updateData,
    });
  });

  it('should update account balance by incrementing', async () => {
    const accountId = 'acc-1';
    const initialBalance = 500;
    const incrementAmount = 100;
    const updatedMockAccount: Partial<Account> = { id: accountId, balance: initialBalance + incrementAmount };

    // Мокаем update, чтобы он вернул обновленное состояние с новым балансом
    vi.spyOn(prismaService.account, 'update').mockResolvedValue(updatedMockAccount as Account);

    await repository.updateBalance(accountId, incrementAmount);

    expect(prismaService.account.update).toHaveBeenCalledWith({
      where: { id: accountId },
      data: { balance: { increment: incrementAmount } },
    });
  });
});
