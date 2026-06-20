import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './product.schema';
import { uuidv7 } from '../common/utils/uuid';

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  take?: number;
}

const LIST_INCLUDE = { category: true, variants: true } as const;

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ProductFilter): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: this.buildWhere(filters),
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { name: 'asc' },
      include: LIST_INCLUDE,
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id }, include: LIST_INCLUDE });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { sku } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: { id: uuidv7(), ...data },
      include: LIST_INCLUDE,
    });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: LIST_INCLUDE,
    });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  async count(filters: Partial<ProductFilter>): Promise<number> {
    return this.prisma.product.count({ where: this.buildWhere(filters) });
  }

  private buildWhere(f: Partial<ProductFilter>): any {
    const where: any = {};
    if (f.isActive !== undefined) where.isActive = f.isActive;
    if (f.categoryId) where.categoryId = f.categoryId;
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      where.price = {};
      if (f.minPrice !== undefined) where.price.gte = f.minPrice;
      if (f.maxPrice !== undefined) where.price.lte = f.maxPrice;
    }
    if (f.search) {
      where.OR = [
        { name: { contains: f.search, mode: 'insensitive' } },
        { sku: { contains: f.search, mode: 'insensitive' } },
        { barcode: { contains: f.search } },
      ];
    }
    return where;
  }
}
