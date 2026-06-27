import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleRepository } from './sale.repository';

@Module({
  providers: [SaleService, SaleRepository],
  exports: [SaleService, SaleRepository],
})
export class SaleModule {}
