import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.model';
import { AdjustStockDto } from './inventory.schema';
import { AuthRole } from '../auth/decorators/auth-role.decorator';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query(() => Inventory, { name: 'inventory' })
  @AuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async getStock(
    @Args('productId') productId: string,
    @Args('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.getStock(productId, warehouseId);
  }

  @Mutation(() => Inventory)
  @AuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async adjustStock(
    @Args('warehouseId') warehouseId: string,
    @Args('data') data: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(warehouseId, data);
  }
}
