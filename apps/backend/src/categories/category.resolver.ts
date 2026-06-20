import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryType } from './category.type';
import { CreateCategoryInput, UpdateCategoryInput } from './category.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => CategoryType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryResolver {
  constructor(private readonly service: CategoryService) {}

  @Query(() => [CategoryType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async categories(
    @Args('includeInactive', { nullable: true, defaultValue: false }) includeInactive?: boolean,
  ) {
    return this.service.getAll(includeInactive);
  }

  @Query(() => [CategoryType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async categoryTree() {
    return this.service.getTree();
  }

  @Query(() => [CategoryType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async rootCategories(
    @Args('includeInactive', { nullable: true, defaultValue: false }) includeInactive?: boolean,
  ) {
    return this.service.getRoots(includeInactive);
  }

  @Query(() => CategoryType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE')
  async category(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => CategoryType)
  @Roles('ADMIN', 'MANAGER')
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return this.service.create({
      name: input.name,
      description: input.description ?? null,
      parentId: input.parentId ?? null,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    });
  }

  @Mutation(() => CategoryType)
  @Roles('ADMIN', 'MANAGER')
  async updateCategory(
    @Args('id') id: string,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => CategoryType)
  @Roles('ADMIN')
  async deleteCategory(@Args('id') id: string) {
    return this.service.delete(id);
  }
}
