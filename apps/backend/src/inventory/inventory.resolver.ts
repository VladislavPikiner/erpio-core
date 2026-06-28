import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryType } from './inventory.type';
import { AdjustStockInput } from './inventory.input';
import { GqlAuthRole } from '../auth/decorators/gql-auth-role.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => InventoryType)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query(() => InventoryType, { name: 'inventory' })
  @GqlAuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async getStock(
    @Args('productId') productId: string,
    @Args('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.getStock(productId, warehouseId);
  }

  @Mutation(() => InventoryType)
  @GqlAuthRole('ADMIN', 'MANAGER', 'WAREHOUSE')
  async adjustStock(
    @Args('warehouseId') warehouseId: string,
    @Args('data') data: AdjustStockInput,
  ) {
    return this.inventoryService.adjustStock(warehouseId, data);
  }
}
