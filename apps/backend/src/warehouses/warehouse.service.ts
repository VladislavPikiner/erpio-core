import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse } from '@prisma/client';
import { CreateWarehouseDto, UpdateWarehouseDto } from './warehouse.schema';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  /**
   * Создать склад в филиале.
   * @param branchId ID филиала
   * @param data Данные склада
   */
  async create(branchId: string, data: CreateWarehouseDto): Promise<Warehouse> {
    // Проверка на уникальность имени в рамках филиала
    const existingWarehouse = await this.warehouseRepository.findAllScoped(branchId, {
      where: { name: data.name },
    });
    if (existingWarehouse.length > 0) {
      throw new BadRequestException(`Warehouse with name '${data.name}' already exists in this branch`);
    }

    return this.warehouseRepository.createScoped(branchId, data);
  }

  /**
   * Найти склад по ID с проверкой принадлежности к филиалу.
   * @param id ID склада
   * @param branchId ID филиала
   */
  async findById(id: string, branchId: string): Promise<Warehouse> {
    return this.warehouseRepository.findByIdScoped(id, branchId);
  }

  /**
   * Получить все склады филиала.
   * @param branchId ID филиала
   */
  async findAll(branchId: string): Promise<Warehouse[]> {
    return this.warehouseRepository.findAllScoped(branchId);
  }

  /**
   * Обновить склад в филиале.
   * @param id ID склада
   * @param branchId ID филиала
   * @param data Данные для обновления
   */
  async update(id: string, branchId: string, data: UpdateWarehouseDto): Promise<Warehouse> {
    // Проверка на уникальность имени в рамках филиала
    if (data.name) {
      const existingWarehouse = await this.warehouseRepository.findAllScoped(branchId, {
        where: { name: data.name, id: { not: id } },
      });
      if (existingWarehouse.length > 0) {
        throw new BadRequestException(`Warehouse with name '${data.name}' already exists in this branch`);
      }
    }

    return this.warehouseRepository.updateScoped(id, branchId, data);
  }

  /**
   * Удалить склад в филиале.
   * @param id ID склада
   * @param branchId ID филиала
   */
  async delete(id: string, branchId: string): Promise<Warehouse> {
    return this.warehouseRepository.deleteScoped(id, branchId);
  }
}
