import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory } from '@prisma/client';
import { BranchScopedRepository } from '../common/repositories/base.repository';

@Injectable()
export class InventoryRepository extends BranchScopedRepository<Inventory> {
  constructor(prisma: PrismaService) {
    super(prisma.inventory);
  }

  /**
   * Найти остатки по ID с проверкой принадлежности к складу.
   * @param id ID остатков
   * @param warehouseId ID склада
   */
  async findByIdScoped(id: string, warehouseId: string): Promise<Inventory> {
    const inventory = await this.model.findUnique({
      where: { id },
      include: { warehouse: true },
    });
    if (!inventory) {
      throw new Error(`Inventory with ID ${id} not found`);
    }
    if (inventory.warehouseId !== warehouseId) {
      throw new Error(`Inventory with ID ${id} does not belong to warehouse ${warehouseId}`);
    }
    return inventory;
  }

  /**
   * Получить все остатки склада.
   * @param warehouseId ID склада
   */
  async findAllScoped(warehouseId: string): Promise<Inventory[]> {
    return this.model.findMany({
      where: { warehouseId },
    });
  }

  /**
   * Создать остатки для товара на складе.
   * @param warehouseId ID склада
   * @param data Данные остатков
   */
  async createScoped(warehouseId: string, data: any): Promise<Inventory> {
    return this.model.create({
      data: { ...data, warehouseId },
    });
  }

  /**
   * Обновить остатки на складе.
   * @param id ID остатков
   * @param warehouseId ID склада
   * @param data Данные для обновления
   */
  async updateScoped(id: string, warehouseId: string, data: any): Promise<Inventory> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Удалить остатки со склада.
   * @param id ID остатков
   * @param warehouseId ID склада
   */
  async deleteScoped(id: string, warehouseId: string): Promise<Inventory> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.delete({ where: { id } });
  }
}
