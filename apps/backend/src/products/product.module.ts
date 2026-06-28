import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { VariantResolver } from './variant.resolver';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { VariantRepository } from './variant.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
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
