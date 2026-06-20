import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductVariantType } from './product.type';
import { CreateProductVariantInput, UpdateProductVariantInput } from './product-variant.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => ProductVariantType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class VariantResolver {
  constructor(private readonly service: ProductService) {}

  @Query(() => [ProductVariantType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async productVariants(@Args('productId') productId: string) {
    return this.service.getVariants(productId);
  }

  @Mutation(() => ProductVariantType)
  @Roles('ADMIN', 'MANAGER')
  async createProductVariant(
    @Args('productId') productId: string,
    @Args('input') input: CreateProductVariantInput,
  ) {
    const attrs = input.attributes ? JSON.parse(input.attributes) : {};
    return this.service.addVariant(productId, {
      name: input.name,
      sku: input.sku,
      price: input.price,
      cost: input.cost ?? 0,
      attributes: attrs,
    });
  }

  @Mutation(() => ProductVariantType)
  @Roles('ADMIN', 'MANAGER')
  async updateProductVariant(
    @Args('id') id: string,
    @Args('input') input: UpdateProductVariantInput,
  ) {
    return this.service.updateVariant(id, {
      ...input,
      attributes: input.attributes ? JSON.parse(input.attributes) : undefined,
    });
  }

  @Mutation(() => ProductVariantType)
  @Roles('ADMIN')
  async deleteProductVariant(@Args('id') id: string) {
    return this.service.deleteVariant(id);
  }
}
