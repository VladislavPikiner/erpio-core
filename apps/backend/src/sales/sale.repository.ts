import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sale } from '@prisma/client';
import { BranchScopedRepository } from '../common/repositories/base.repository';

export class SaleRepository extends BranchScopedRepository<Sale> {
  constructor(prisma: PrismaService) {
    super(prisma.sale);
  }

  /**
   * Найти продажу по ID с проверкой принадлежности к складу.
   * @param id ID продажи
   * @param warehouseId ID склада
   */
  async findByIdScoped(id: string, warehouseId: string): Promise<Sale> {
    const sale = await this.model.findUnique({
      where: { id },
      include: { warehouse: true },
    });
    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }
    if (sale.warehouseId !== warehouseId) {
      throw new Error(`Sale with ID ${id} does not belong to warehouse ${warehouseId}`);
    }
    return sale;
  }

  /**
   * Получить все продажи склада.
   * @param warehouseId ID склада
   * @param filter Фильтр (тип any для совместимости с текущим вызовом)
   */
  async findAllScoped(warehouseId: string, filter: any = {}): Promise<Sale[]> {
    return this.model.findMany({
      where: { warehouseId, ...filter },
    });
  }

  /**
   * Создать продажу на складе.
   * @param warehouseId ID склада
   * @param data Данные продажи
   */
  async createScoped(warehouseId: string, data: any): Promise<Sale> {
    return this.model.create({
      data: { ...data, warehouseId },
    });
  }

  /**
   * Обновить продажу на складе.
   * @param id ID продажи
   * @param warehouseId ID склада
   * @param data Данные для обновления
   */
  async updateScoped(id: string, warehouseId: string, data: any): Promise<Sale> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Удалить продажу со склада.
   * @param id ID продажи
   * @param warehouseId ID склада
   */
  async deleteScoped(id: string, warehouseId: string): Promise<Sale> {
    await this.findByIdScoped(id, warehouseId);
    return this.model.delete({ where: { id } });
  }
}
