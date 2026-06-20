import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseRepository } from './warehouse.repository';
import { StockRepository } from './stock.repository';
import { StockMovementRepository } from './stock-movement.repository';
import { Warehouse } from '@prisma/client';
import { CreateWarehouseDto, UpdateWarehouseDto, CreateStockMovementDto } from './inventory.schema';

/**
 * Сервис управления складом.
 *
 * - **Склады** (несколько физических точек хранения)
 * - **Остатки** (`StockItem`) — количественный учёт по товару + склад
 * - **Движения** (`StockMovement`) — оприходование (IN), списание (OUT),
 *   перемещение (TRANSFER). Каждое движение создаёт запись и корректирует остаток.
 *
 * Движения типа OUT автоматически уменьшают остаток (отрицательная дельта).
 */
@Injectable()
export class InventoryService {
  constructor(
    private readonly warehouseRepo: WarehouseRepository,
    private readonly stockRepo: StockRepository,
    private readonly movementRepo: StockMovementRepository,
  ) {}

  // ═══════════════════════════════════════
  //  Warehouses
  // ═══════════════════════════════════════

  /** Все склады. */
  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepo.findAll();
  }

  /** Склад по id. */
  async getWarehouseById(id: string): Promise<Warehouse> {
    const w = await this.warehouseRepo.findById(id);
    if (!w) throw new NotFoundException(`Склад с ID ${id} не найден`);
    return w;
  }

  /** Создать склад. */
  async createWarehouse(data: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehouseRepo.create(data);
  }

  /** Обновить склад. */
  async updateWarehouse(id: string, data: UpdateWarehouseDto): Promise<Warehouse> {
    await this.getWarehouseById(id);
    return this.warehouseRepo.update(id, data);
  }

  /** Удалить склад. */
  async deleteWarehouse(id: string): Promise<Warehouse> {
    await this.getWarehouseById(id);
    return this.warehouseRepo.delete(id);
  }

  // ═══════════════════════════════════════
  //  Stock
  // ═══════════════════════════════════════

  /** Остатки с фильтрацией. */
  async getStock(filters: {
    warehouseId?: string;
    productId?: string;
    lowStock?: boolean;
    skip?: number;
    take?: number;
  }) {
    const items = await this.stockRepo.findAll(filters);
    return { items, total: items.length };
  }

  /** Количество товаров ниже минимального порога. */
  async lowStockCount(): Promise<number> {
    return this.stockRepo.countLowStock();
  }

  // ═══════════════════════════════════════
  //  Movements
  // ═══════════════════════════════════════

  /**
   * Создать движение товара и скорректировать остаток.
   *
   * - IN → quantity добавляется к остатку
   * - OUT → quantity вычитается из остатка
   * - TRANSFER → quantity вычитается из источника (в приёмник — отдельное движение)
   */
  async createMovement(data: CreateStockMovementDto & { userId?: string }) {
    await this.getWarehouseById(data.warehouseId);
    const movement = await this.movementRepo.create(data);

    const delta = data.type === 'OUT' || data.type === 'TRANSFER'
      ? -Math.abs(data.quantity)
      : Math.abs(data.quantity);
    await this.stockRepo.adjustQuantity(data.productId, data.warehouseId, delta);

    return movement;
  }

  /** История движений. */
  async getMovements(productId?: string, warehouseId?: string, limit = 50) {
    return this.movementRepo.findAll(productId, warehouseId, limit);
  }
}
