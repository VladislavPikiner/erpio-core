import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { CustomerGroupType } from './customer-group.type';
import { CreateCustomerGroupInput, UpdateCustomerGroupInput } from './customer-group.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => CustomerGroupType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerGroupResolver {
  constructor(private readonly service: CustomerService) {}

  @Query(() => [CustomerGroupType])
  @Roles('ADMIN', 'MANAGER')
  async customerGroups() {
    return this.service.getAllGroups();
  }

  @Query(() => CustomerGroupType)
  @Roles('ADMIN', 'MANAGER')
  async customerGroup(@Args('id') id: string) {
    return this.service.getGroupById(id);
  }

  @Mutation(() => CustomerGroupType)
  @Roles('ADMIN')
  async createCustomerGroup(@Args('input') input: CreateCustomerGroupInput) {
    return this.service.createGroup({
      name: input.name,
      discount: input.discount ?? 0,
    });
  }

  @Mutation(() => CustomerGroupType)
  @Roles('ADMIN')
  async updateCustomerGroup(@Args('id') id: string, @Args('input') input: UpdateCustomerGroupInput) {
    return this.service.updateGroup(id, input);
  }

  @Mutation(() => CustomerGroupType)
  @Roles('ADMIN')
  async deleteCustomerGroup(@Args('id') id: string) {
    return this.service.deleteGroup(id);
  }
}
