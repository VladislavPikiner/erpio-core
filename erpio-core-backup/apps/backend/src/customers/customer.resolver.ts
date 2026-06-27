import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { CustomerType } from './customer.type';
import { CreateCustomerInput, UpdateCustomerInput, CustomerFilterInput } from './customer.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => CustomerType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerResolver {
  constructor(private readonly service: CustomerService) {}

  @Query(() => [CustomerType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async customers(@Args('filter', { nullable: true }) filter?: CustomerFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.items;
  }

  @Query(() => Int)
  @Roles('ADMIN', 'MANAGER')
  async customersCount(@Args('filter', { nullable: true }) filter?: CustomerFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.total;
  }

  @Query(() => CustomerType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async customer(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => CustomerType)
  @Roles('ADMIN', 'MANAGER')
  async createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.service.create({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      taxId: input.taxId ?? null,
      groupId: input.groupId ?? null,
      discount: input.discount ?? 0,
      notes: input.notes ?? null,
      isActive: input.isActive ?? true,
    });
  }

  @Mutation(() => CustomerType)
  @Roles('ADMIN', 'MANAGER')
  async updateCustomer(@Args('id') id: string, @Args('input') input: UpdateCustomerInput) {
    return this.service.update(id, {
      ...input,
      discount: input.discount ?? undefined,
      groupId: input.groupId ?? null,
    });
  }

  @Mutation(() => CustomerType)
  @Roles('ADMIN')
  async deleteCustomer(@Args('id') id: string) {
    return this.service.delete(id);
  }
}
