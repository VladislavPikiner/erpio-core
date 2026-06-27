import { Module } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferRepository } from './stock-transfer.repository';

@Module({
  providers: [StockTransferService, StockTransferRepository],
  exports: [StockTransferService, StockTransferRepository],
})
export class StockTransferModule {}
