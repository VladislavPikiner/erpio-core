import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { WarehouseType } from './warehouse.type';
import { StockItemType, StockMovementType } from './stock.type';
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  CreateStockMovementInput,
  StockFilterInput,
} from './inventory.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryResolver {
  constructor(private readonly service: InventoryService) {}

  // ── Warehouses ──

  @Query(() => [WarehouseType])
  @Roles('ADMIN', 'MANAGER', 'WAREHOUSE')
  async warehouses() {
    return this.service.getAllWarehouses();
  }

  @Query(() => WarehouseType)
  @Roles('ADMIN', 'MANAGER', 'WAREHOUSE')
  async warehouse(@Args('id') id: string) {
    return this.service.getWarehouseById(id);
  }

  @Mutation(() => WarehouseType)
  @Roles('ADMIN')
  async createWarehouse(@Args('input') input: CreateWarehouseInput) {
    return this.service.createWarehouse({
      name: input.name,
      address: input.address ?? null,
      isActive: input.isActive ?? true,
    });
  }

  @Mutation(() => WarehouseType)
  @Roles('ADMIN')
  async updateWarehouse(
    @Args('id') id: string,
    @Args('input') input: UpdateWarehouseInput,
  ) {
    return this.service.updateWarehouse(id, input);
  }

  @Mutation(() => WarehouseType)
  @Roles('ADMIN')
  async deleteWarehouse(@Args('id') id: string) {
    return this.service.deleteWarehouse(id);
  }

  // ── Stock ──

  @Query(() => [StockItemType])
  @Roles('ADMIN', 'MANAGER', 'WAREHOUSE', 'CASHIER')
  async stock(@Args('filter', { nullable: true }) filter?: StockFilterInput) {
    const result = await this.service.getStock(filter ?? {});
    return result.items;
  }

  @Query(() => Int)
  @Roles('ADMIN', 'MANAGER')
  async lowStockCount() {
    return this.service.lowStockCount();
  }

  // ── Movements ──

  @Mutation(() => StockMovementType)
  @Roles('ADMIN', 'MANAGER', 'WAREHOUSE')
  async createStockMovement(@Args('input') input: CreateStockMovementInput) {
    return this.service.createMovement({
      productId: input.productId,
      warehouseId: input.warehouseId,
      type: input.type as 'IN' | 'OUT' | 'TRANSFER',
      quantity: input.quantity,
      reference: input.reference ?? null,
      notes: input.notes ?? null,
    });
  }

  @Query(() => [StockMovementType])
  @Roles('ADMIN', 'MANAGER', 'WAREHOUSE')
  async stockMovements(
    @Args('productId', { nullable: true }) productId?: string,
    @Args('warehouseId', { nullable: true }) warehouseId?: string,
    @Args('limit', { nullable: true, defaultValue: 50 }) limit?: number,
  ) {
    return this.service.getMovements(productId, warehouseId, limit);
  }
}
