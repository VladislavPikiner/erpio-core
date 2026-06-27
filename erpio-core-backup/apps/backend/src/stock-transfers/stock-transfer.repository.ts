import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockTransfer } from '@prisma/client';
import { BranchScopedRepository } from '../common/repositories/base.repository';

@Injectable()
export class StockTransferRepository extends BranchScopedRepository<StockTransfer> {
  constructor(prisma: PrismaService) {
    super(prisma.stockTransfer);
  }

  /**
   * Найти перемещение по ID с проверкой принадлежности к складу.
   * @param id ID перемещения
   * @param warehouseId ID склада (откуда или куда)
   */
  async findByIdScoped(id: string, warehouseId: string): Promise<StockTransfer> {
    const transfer = await this.model.findUnique({
      where: { id },
      include: { fromWarehouse: true, toWarehouse: true },
    });
    if (!transfer) {
      throw new Error(`StockTransfer with ID ${id} not found`);
    }
    if (transfer.fromWarehouseId !== warehouseId && transfer.toWarehouseId !== warehouseId) {
      throw new Error(`StockTransfer with ID ${id} does not belong to warehouse ${warehouseId}`);
    }
    return transfer;
  }

  /**
   * Получить все перемещения для склада (откуда или куда).
   * @param warehouseId ID склада
   * @param params Опции поиска
   */
  async findAllScoped(warehouseId: string, params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  } = {}): Promise<StockTransfer[]> {
    const { skip, take, where, orderBy } = params;
    return this.model.findMany({
      where: {
        ...where,
        OR: [
          { fromWarehouseId: warehouseId },
          { toWarehouseId: warehouseId },
        ],
      },
      skip,
      take,
      orderBy,
    });
  }

  /**
   * Создать перемещение между складами.
   * @param branchId ID филиала (в рамках базового класса)
   * @param data Данные перемещения, включая fromWarehouseId и toWarehouseId
   */
  async createScoped(branchId: string, data: any): Promise<StockTransfer> {
    return this.model.create({
      data: { ...data },
    });
  }

  /**
   * Обновить перемещение.
   * @param id ID перемещения
   * @param warehouseId ID склада (откуда или куда)
   * @param data Данные для обновления
   */
  async updateScoped(id: string, warehouseId: string, data: any): Promise<StockTransfer> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Удалить перемещение.
   * @param id ID перемещения
   * @param warehouseId ID склада (откуда или куда)
   */
  async deleteScoped(id: string, warehouseId: string): Promise<StockTransfer> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.delete({ where: { id } });
  }
}
