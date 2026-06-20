import { Module } from '@nestjs/common';
import { CustomerResolver } from './customer.resolver';
import { CustomerGroupResolver } from './customer-group.resolver';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';

@Module({
  providers: [
    CustomerResolver,
    CustomerGroupResolver,
    CustomerService,
    CustomerRepository,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
