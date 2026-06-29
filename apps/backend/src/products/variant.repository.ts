import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ProductVariant } from '@prisma/client';

export interface CreateVariantData {
  productId: string;
  name: string;
  sku: string;
  price: number;
  cost?: number;
  attributes?: string;
}

export interface UpdateVariantData {
  name?: string;
  sku?: string;
  price?: number;
  cost?: number;
  attributes?: string;
  isActive?: boolean;
}

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

  async create(data: CreateVariantData): Promise<ProductVariant> {
    return super.create({ ...data, attributes: data.attributes ?? '{}' });
  }

  async update(id: string, data: UpdateVariantData): Promise<ProductVariant> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ProductVariant> {
    return this.model.delete({ where: { id } });
  }
}
