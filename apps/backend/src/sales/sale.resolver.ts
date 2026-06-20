import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SaleService } from './sale.service';
import { SaleType, PaymentType } from './sale.type';
import { CreateSaleInput, CreatePaymentInput, SaleFilterInput } from './sale.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthRole } from '../auth/decorators/auth-role.decorator';

@Resolver(() => SaleType)
export class SaleResolver {
  constructor(private readonly service: SaleService) {}

  @Query(() => [SaleType])
  @AuthRole('ADMIN', 'MANAGER', 'CASHIER')
  async sales(@Args('filter', { nullable: true }) filter?: SaleFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.items;
  }

  @Query(() => Int)
  @AuthRole('ADMIN', 'MANAGER', 'CASHIER')
  async salesCount(@Args('filter', { nullable: true }) filter?: SaleFilterInput) {
    const result = await this.service.getAll(filter ?? {});
    return result.total;
  }

  @Query(() => SaleType)
  @AuthRole('ADMIN', 'MANAGER', 'CASHIER')
  async sale(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => SaleType)
  @AuthRole('ADMIN', 'MANAGER', 'CASHIER')
  async createSale(@Args('input') input: CreateSaleInput) {
    return this.service.create({
      customerId: input.customerId ?? null,
      discount: input.discount,
      notes: input.notes ?? null,
      items: input.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discount ?? 0,
      })),
    });
  }

  @Mutation(() => SaleType)
  @Roles('ADMIN', 'MANAGER')
  async cancelSale(@Args('id') id: string) {
    return this.service.cancel(id);
  }

  @Mutation(() => SaleType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async completeSale(@Args('id') id: string) {
    return this.service.complete(id);
  }

  @Mutation(() => PaymentType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async addPayment(@Args('input') input: CreatePaymentInput) {
    return this.service.addPayment({
      saleId: input.saleId,
      amount: input.amount,
      method: input.method as 'CASH' | 'CARD' | 'TRANSFER',
      reference: input.reference ?? null,
    });
  }

  @Query(() => [PaymentType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async salePayments(@Args('saleId') saleId: string) {
    return this.service.getPayments(saleId);
  }
}
