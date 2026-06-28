import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CategoryResolver, CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
