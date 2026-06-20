import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FinanceService } from './finance.service';
import { AccountType, TransactionType, InvoiceType } from './finance.type';
import {
  CreateAccountInput,
  UpdateAccountInput,
  CreateTransactionInput,
  CreateInvoiceInput,
  InvoiceFilterInput,
} from './finance.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceResolver {
  constructor(private readonly service: FinanceService) {}

  // ── Accounts ──

  @Query(() => [AccountType])
  @Roles('ADMIN', 'MANAGER')
  async accounts() {
    return this.service.getAllAccounts();
  }

  @Query(() => AccountType)
  @Roles('ADMIN', 'MANAGER')
  async account(@Args('id') id: string) {
    return this.service.getAccountById(id);
  }

  @Mutation(() => AccountType)
  @Roles('ADMIN')
  async createAccount(@Args('input') input: CreateAccountInput) {
    return this.service.createAccount({
      name: input.name,
      type: input.type,
      currency: input.currency ?? 'RUB',
      isActive: input.isActive ?? true,
    });
  }

  @Mutation(() => AccountType)
  @Roles('ADMIN')
  async updateAccount(@Args('id') id: string, @Args('input') input: UpdateAccountInput) {
    return this.service.updateAccount(id, input);
  }

  // ── Transactions ──

  @Mutation(() => TransactionType)
  @Roles('ADMIN', 'MANAGER')
  async createTransaction(@Args('input') input: CreateTransactionInput) {
    return this.service.createTransaction({
      accountId: input.accountId,
      type: input.type as 'DEBIT' | 'CREDIT',
      amount: input.amount,
      description: input.description ?? null,
      referenceType: input.referenceType ?? null,
      referenceId: input.referenceId ?? null,
    });
  }

  @Query(() => [TransactionType])
  @Roles('ADMIN', 'MANAGER')
  async transactions(
    @Args('accountId', { nullable: true }) accountId?: string,
    @Args('limit', { nullable: true, defaultValue: 50 }) limit?: number,
  ) {
    return this.service.getTransactions(accountId, limit);
  }

  // ── Invoices ──

  @Query(() => [InvoiceType])
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async invoices(@Args('filter', { nullable: true }) filter?: InvoiceFilterInput) {
    const result = await this.service.getAllInvoices(filter ?? {});
    return result.items;
  }

  @Query(() => Int)
  @Roles('ADMIN', 'MANAGER')
  async invoicesCount(@Args('filter', { nullable: true }) filter?: InvoiceFilterInput) {
    const result = await this.service.getAllInvoices(filter ?? {});
    return result.total;
  }

  @Query(() => InvoiceType)
  @Roles('ADMIN', 'MANAGER', 'CASHIER')
  async invoice(@Args('id') id: string) {
    return this.service.getInvoiceById(id);
  }

  @Mutation(() => InvoiceType)
  @Roles('ADMIN', 'MANAGER')
  async createInvoice(@Args('input') input: CreateInvoiceInput) {
    return this.service.createInvoice({
      customerId: input.customerId ?? null,
      dueDate: input.dueDate,
      subtotal: input.subtotal,
      tax: input.tax ?? 0,
      notes: input.notes ?? null,
    });
  }

  @Mutation(() => InvoiceType)
  @Roles('ADMIN', 'MANAGER')
  async markInvoicePaid(@Args('id') id: string) {
    return this.service.markInvoicePaid(id);
  }

  @Mutation(() => InvoiceType)
  @Roles('ADMIN')
  async cancelInvoice(@Args('id') id: string) {
    return this.service.updateInvoiceStatus(id, 'CANCELLED');
  }
}
