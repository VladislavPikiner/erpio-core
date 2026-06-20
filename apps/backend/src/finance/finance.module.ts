import { Module } from '@nestjs/common';
import { FinanceResolver } from './finance.resolver';
import { FinanceService } from './finance.service';
import { AccountRepository } from './account.repository';
import { TransactionRepository } from './transaction.repository';
import { InvoiceRepository } from './invoice.repository';

@Module({
  providers: [
    FinanceResolver,
    FinanceService,
    AccountRepository,
    TransactionRepository,
    InvoiceRepository,
  ],
  exports: [FinanceService],
})
export class FinanceModule {}
