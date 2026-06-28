import { Module, forwardRef } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { VariantResolver } from './variant.resolver';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { VariantRepository } from './variant.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { WarehouseModule } from '../warehouses/warehouse.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => InventoryModule),
    forwardRef(() => WarehouseModule),
  ],
  providers: [
    ProductResolver,
    VariantResolver,
    ProductService,
    ProductRepository,
    VariantRepository,
  ],
  exports: [ProductService],
})
export class ProductModule {}
