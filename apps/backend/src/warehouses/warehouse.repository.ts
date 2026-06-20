import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Warehouse } from '@prisma/client';
import { BranchScopedRepository } from '../common/repositories/base.repository';

@Injectable()
export class WarehouseRepository extends BranchScopedRepository<Warehouse> {
  constructor(prisma: PrismaService) {
    super(prisma.warehouse);
  }

  /**
   * Найти склад по ID с проверкой принадлежности к филиалу.
   * @param id ID склада
   * @param branchId ID филиала
   */
  async findByIdScoped(id: string, branchId: string): Promise<Warehouse> {
    return super.findByIdScoped(id, branchId);
  }

  /**
   * Получить все склады филиала.
   * @param branchId ID филиала
   */
  async findAllScoped(branchId: string): Promise<Warehouse[]> {
    return super.findAllScoped(branchId);
  }

  /**
   * Создать склад в филиале.
   * @param branchId ID филиала
   * @param data Данные склада
   */
  async createScoped(branchId: string, data: any): Promise<Warehouse> {
    return super.createScoped(branchId, data);
  }

  /**
   * Обновить склад в филиале.
   * @param id ID склада
   * @param branchId ID филиала
   * @param data Данные для обновления
   */
  async updateScoped(id: string, branchId: string, data: any): Promise<Warehouse> {
    return super.updateScoped(id, branchId, data);
  }

  /**
   * Удалить склад в филиале.
   * @param id ID склада
   * @param branchId ID филиала
   */
  async deleteScoped(id: string, branchId: string): Promise<Warehouse> {
    return super.deleteScoped(id, branchId);
  }
}
