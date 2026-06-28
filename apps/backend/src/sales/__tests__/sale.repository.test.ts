import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaleRepository } from '../sale.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Sale } from '@prisma/client';

describe('SaleRepository', () => {
  let repository: SaleRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    // Мокаем PrismaService
    prismaService = {
      sale: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as PrismaService;

    repository = new SaleRepository(prismaService);
  });

  // Тесты для findByIdScoped
  it('should find sale by id scoped', async () => {
    const mockSale: Partial<Sale> = { id: 'sale-1', warehouseId: 'wh-1' };
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(mockSale as Sale);

    const result = await repository.findByIdScoped('sale-1', 'wh-1');

    expect(result).toEqual(mockSale);
    expect(prismaService.sale.findUnique).toHaveBeenCalledWith({
      where: { id: 'sale-1' },
      include: { warehouse: true },
    });
  });

  it('should throw error if sale not found', async () => {
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(null);

    await expect(repository.findByIdScoped('sale-1', 'wh-1')).rejects.toThrow('Sale with ID sale-1 not found');
  });

  it('should throw error if sale belongs to another warehouse', async () => {
    const mockSale: Partial<Sale> = { id: 'sale-1', warehouseId: 'wh-2' };
    vi.spyOn(repository['model'], 'findUnique').mockResolvedValue(mockSale as Sale);

    await expect(repository.findByIdScoped('sale-1', 'wh-1')).rejects.toThrow('Sale with ID sale-1 does not belong to warehouse wh-1');
  });

  // Тесты для findAllScoped
  it('should find all sales for a warehouse with filters', async () => {
    const mockSales: Partial<Sale>[] = [
      { id: 'sale-1', warehouseId: 'wh-1', createdAt: new Date('2023-01-01') },
      { id: 'sale-2', warehouseId: 'wh-1', createdAt: new Date('2023-01-02') },
    ];
    const filter = { createdAt: { gt: new Date('2023-01-01') } };
    vi.spyOn(repository['model'], 'findMany').mockResolvedValue(mockSales as Sale[]);

    const result = await repository.findAllScoped('wh-1', filter);

    expect(result).toEqual(mockSales);
    expect(prismaService.sale.findMany).toHaveBeenCalledWith({
      where: { warehouseId: 'wh-1', ...filter },
    });
  });

  it('should find all sales for a warehouse without filters', async () => {
    const mockSales: Partial<Sale>[] = [
      { id: 'sale-1', warehouseId: 'wh-1' },
      { id: 'sale-2', warehouseId: 'wh-1' },
    ];
    vi.spyOn(repository['model'], 'findMany').mockResolvedValue(mockSales as Sale[]);

    const result = await repository.findAllScoped('wh-1');

    expect(result).toEqual(mockSales);
    expect(prismaService.sale.findMany).toHaveBeenCalledWith({
      where: { warehouseId: 'wh-1' },
    });
  });

  // Тесты для createScoped
  it('should create a sale for a warehouse', async () => {
    const mockSale: Partial<Sale> = { id: 'sale-new', warehouseId: 'wh-1', amount: 100 };
    const createData = { amount: 100 };
    vi.spyOn(repository['model'], 'create').mockResolvedValue(mockSale as Sale);

    const result = await repository.createScoped('wh-1', createData);

    expect(result).toEqual(mockSale);
    expect(prismaService.sale.create).toHaveBeenCalledWith({
      data: { ...createData, warehouseId: 'wh-1' },
    });
  });

  // Тесты для updateScoped
  it('should update a sale for a warehouse', async () => {
    const saleId = 'sale-1';
    const warehouseId = 'wh-1';
    const updateData = { amount: 150 };
    const updatedMockSale: Partial<Sale> = { id: saleId, warehouseId: warehouseId, amount: 150 };

    vi.spyOn(repository as any, 'findByIdScoped').mockResolvedValue({ id: saleId, warehouseId: warehouseId, amount: 100 } as Sale);
    vi.spyOn(repository['model'], 'update').mockResolvedValue(updatedMockSale as Sale);

    const result = await repository.updateScoped(saleId, warehouseId, updateData);

    expect(result).toEqual(updatedMockSale);
    expect(prismaService.sale.update).toHaveBeenCalledWith({
      where: { id: saleId },
      data: updateData,
    });
  });

  it('should throw error if sale not found during update', async () => {
    const saleId = 'sale-1';
    const warehouseId = 'wh-1';
    const updateData = { amount: 150 };

    vi.spyOn(repository as any, 'findByIdScoped').mockRejectedWith(new Error(`Sale with ID ${saleId} not found`));

    await expect(repository.updateScoped(saleId, warehouseId, updateData)).rejects.toThrow(`Sale with ID ${saleId} not found`);
    expect(prismaService.sale.update).not.toHaveBeenCalled();
  });

  // Тесты для deleteScoped
  it('should delete a sale for a warehouse', async () => {
    const saleId = 'sale-1';
    const warehouseId = 'wh-1';
    const deletedMockSale: Partial<Sale> = { id: saleId, warehouseId: warehouseId };

    vi.spyOn(repository as any, 'findByIdScoped').mockResolvedValue({ id: saleId, warehouseId: warehouseId } as Sale);
    vi.spyOn(repository['model'], 'delete').mockResolvedValue(deletedMockSale as Sale);

    const result = await repository.deleteScoped(saleId, warehouseId);

    expect(result).toEqual(deletedMockSale);
    expect(prismaService.sale.delete).toHaveBeenCalledWith({ where: { id: saleId } });
  });

  it('should throw error if sale not found during delete', async () => {
    const saleId = 'sale-1';
    const warehouseId = 'wh-1';

    vi.spyOn(repository as any, 'findByIdScoped').mockRejectedWith(new Error(`Sale with ID ${saleId} not found`));

    await expect(repository.deleteScoped(saleId, warehouseId)).rejects.toThrow(`Sale with ID ${saleId} not found`);
    expect(prismaService.sale.delete).not.toHaveBeenCalled();
  });
});
