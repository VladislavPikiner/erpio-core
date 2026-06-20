import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ProductVariant } from '@prisma/client';
import { CreateVariantData, UpdateVariantData } from './variant.schema';

@Injectable()
export class VariantRepository extends BaseRepository<ProductVariant> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.productVariant);
  }

  async findByProduct(productId: string): Promise<ProductVariant[]> {
    return this.model.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });
  }

  async create(productId: string, data: CreateVariantData): Promise<ProductVariant> {
    return this.model.create({
      data: { productId, ...data, attributes: data.attributes ?? {} },
    });
  }

  async update(id: string, data: UpdateVariantData): Promise<ProductVariant> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ProductVariant> {
    return this.model.delete({ where: { id } });
  }
}
