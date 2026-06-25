import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { InventoryType } from './inventory.type';
import { AdjustStockDto } from './inventory.schema';
import { AuthRole } from '../auth/decorators/auth-role.decorator';

@Resolver(() => InventoryType)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query(() => InventoryType, { name: 'inventory' })
  @AuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async getStock(
    @Args('productId') productId: string,
    @Args('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.getStock(productId, warehouseId);
  }

  @Mutation(() => InventoryType)
  @AuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async adjustStock(
    @Args('warehouseId') warehouseId: string,
    @Args('data') data: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(warehouseId, data);
  }
}
