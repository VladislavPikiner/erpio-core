import { Module } from '@nestjs/common';
import { SaleResolver } from './sale.resolver';
import { SaleService } from './sale.service';
import { SaleRepository } from './sale.repository';
import { SaleItemRepository } from './sale-item.repository';
import { PaymentRepository } from './payment.repository';

@Module({
  providers: [
    SaleResolver,
    SaleService,
    SaleRepository,
    SaleItemRepository,
    PaymentRepository,
  ],
  exports: [SaleService],
})
export class SaleModule {}
