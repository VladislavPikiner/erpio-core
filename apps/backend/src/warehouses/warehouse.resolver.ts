import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from '@prisma/client';
import { CreateWarehouseDto } from './warehouse.schema';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [Warehouse])
  async warehouses(@Args('branchId') branchId: string) {
    return this.warehouseService.findAll(branchId);
  }

  @Mutation(() => Warehouse)
  async createWarehouse(
    @Args('branchId') branchId: string,
    @Args('data') data: CreateWarehouseDto,
  ) {
    return this.warehouseService.create(branchId, data);
  }
}
