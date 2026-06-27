import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { WarehouseType } from './warehouse.type';
import { CreateWarehouseDto } from './warehouse.schema';

@Resolver(() => WarehouseType)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [WarehouseType])
  async warehouses(@Args('branchId') branchId: string) {
    return this.warehouseService.findAll(branchId);
  }

  @Mutation(() => WarehouseType)
  async createWarehouse(
    @Args('branchId') branchId: string,
    @Args('data') data: CreateWarehouseDto,
  ) {
    return this.warehouseService.create(branchId, data);
  }
}
