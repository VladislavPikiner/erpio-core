import { Module, forwardRef } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';

import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ProductModule),
  ],
  providers: [WarehouseService, WarehouseRepository],
  exports: [WarehouseService, WarehouseRepository],
})
export class WarehouseModule {}
