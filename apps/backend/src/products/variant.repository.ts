import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductVariant } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

export interface CreateVariantData {
  name: string;
  sku: string;
  price: number;
  cost?: number;
  attributes?: Record<string, any>;
}

export interface UpdateVariantData {
  name?: string;
  sku?: string;
  price?: number;
  cost?: number;
  attributes?: Record<string, any>;
  isActive?: boolean;
}

@Injectable()
export class VariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string): Promise<ProductVariant[]> {
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });
  }

  async create(productId: string, data: CreateVariantData): Promise<ProductVariant> {
    return this.prisma.productVariant.create({
      data: { id: uuidv7(), productId, ...data, attributes: data.attributes ?? {} },
    });
  }

  async update(id: string, data: UpdateVariantData): Promise<ProductVariant> {
    return this.prisma.productVariant.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ProductVariant> {
    return this.prisma.productVariant.delete({ where: { id } });
  }
}
