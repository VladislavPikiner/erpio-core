import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './product.schema';

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  branchId?: string;
}

const LIST_INCLUDE = { category: true, variants: true } as const;

export class ProductRepository extends BaseRepository<Product> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.product);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    filters?: ProductFilter;
  } = {}): Promise<Product[]> {
    const { skip, take, where, orderBy, filters } = params;
    return this.model.findMany({
      where: { ...where, ...this.buildWhere(filters ?? {}) },
      skip,
      take,
      orderBy: orderBy ?? { name: 'asc' },
      include: LIST_INCLUDE,
    });
  }

  async findById(id: string | number): Promise<Product> {
    const product = await this.model.findUnique({ where: { id }, include: LIST_INCLUDE });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.model.findUnique({ where: { sku } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.model.create({
      data,
      include: LIST_INCLUDE,
    });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.model.update({
      where: { id },
      data,
      include: LIST_INCLUDE,
    });
  }

  async count(filters: Partial<ProductFilter>): Promise<number> {
    return this.model.count({ where: this.buildWhere(filters) });
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
    if (f.branchId) {
      where.inventory = {
        some: {
          warehouse: {
            branchId: f.branchId,
          },
        },
      };
    }
    return where;
  }
}
