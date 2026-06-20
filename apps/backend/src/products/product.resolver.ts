import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductType } from './product.type';
import { CreateProductInput, UpdateProductInput, ProductFilterInput } from './product.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => ProductType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductResolver {
  constructor(private readonly service: ProductService) {}

  @Query(() => [ProductType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async products(@Args('filter', { nullable: true }) filter?: ProductFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.items;
  }

  @Query(() => Int)
  @Roles('ADMIN', 'MANAGER')
  async productsCount(@Args('filter', { nullable: true }) filter?: ProductFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.total;
  }

  @Query(() => ProductType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async product(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => ProductType)
  @Roles('ADMIN', 'MANAGER')
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.service.create({
      name: input.name,
      description: input.description ?? null,
      sku: input.sku,
      barcode: input.barcode ?? null,
      unit: input.unit ?? 'шт',
      price: input.price,
      cost: input.cost ?? 0,
      categoryId: input.categoryId ?? null,
      image: input.image ?? null,
      isActive: input.isActive ?? true,
    });
  }

  @Mutation(() => ProductType)
  @Roles('ADMIN', 'MANAGER')
  async updateProduct(@Args('id') id: string, @Args('input') input: UpdateProductInput) {
    return this.service.update(id, { ...input, categoryId: input.categoryId ?? null });
  }

  @Mutation(() => ProductType)
  @Roles('ADMIN')
  async deleteProduct(@Args('id') id: string) {
    return this.service.delete(id);
  }
}
