import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryRepository } from '../inventory.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('InventoryRepository', () => {
  let repository: InventoryRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    // Мокаем PrismaService
    prismaService = {
      inventory: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as PrismaService;

    repository = new InventoryRepository(prismaService);
  });

  it('should find inventory by id scoped', async () => {
    const mockInventory = { id: 'inv-1', warehouseId: 'wh-1' };
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(mockInventory as any);

    const result = await repository.findByIdScoped('inv-1', 'wh-1');
    
    expect(result).toEqual(mockInventory);
    expect(prismaService.inventory.findUnique).toHaveBeenCalledWith({
      where: { id: 'inv-1' },
      include: { warehouse: true },
    });
  });

  it('should throw error if inventory not found', async () => {
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(null);

    await expect(repository.findByIdScoped('inv-1', 'wh-1')).rejects.toThrow('Inventory with ID inv-1 not found');
  });

  it('should throw error if inventory belongs to another warehouse', async () => {
    const mockInventory = { id: 'inv-1', warehouseId: 'wh-2' }; // Different warehouse
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(mockInventory as any);

    await expect(repository.findByIdScoped('inv-1', 'wh-1')).rejects.toThrow('Inventory with ID inv-1 does not belong to warehouse wh-1');
  });
});
