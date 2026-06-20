import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { VariantRepository, CreateVariantData, UpdateVariantData } from './variant.repository';
import { Product, ProductVariant } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './product.schema';

/**
 * Сервис товаров и модификаций (вариантов).
 *
 * - Уникальность SKU защищена на уровне сервиса (проверка перед create/update)
 * - Товар может иметь множество вариантов (цвет, размер, фасовка)
 * - Все цены хранятся в копейках (Int)
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly variantRepo: VariantRepository,
  ) {}

  // ═══════════════════════════════════════
  //  Products
  // ═══════════════════════════════════════

  /** Список товаров с фильтрацией и пагинацией. */
  async getAll(
    filters: {
      search?: string;
      categoryId?: string;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
      branchId?: string;
      skip?: number;
      take?: number;
    } = {},
  ): Promise<{ items: Product[]; total: number }> {
    const [items, total] = await Promise.all([
      this.productRepo.findAll(filters),
      this.productRepo.count(filters),
    ]);
    return { items, total };
  }

  /** Товар по id с категорией и вариантами. */
  async getById(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException(`Товар с ID ${id} не найден`);
    return product;
  }

  /** Создать товар. SKU должен быть уникальным. */
  async create(data: CreateProductDto): Promise<Product> {
    const existing = await this.productRepo.findBySku(data.sku);
    if (existing) throw new ConflictException(`Товар с артикулом ${data.sku} уже существует`);
    return this.productRepo.create(data);
  }

  /** Обновить товар. */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    await this.getById(id);
    if (data.sku) {
      const existing = await this.productRepo.findBySku(data.sku);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Товар с артикулом ${data.sku} уже существует`);
      }
    }
    return this.productRepo.update(id, data);
  }

  /** Удалить товар. */
  async delete(id: string): Promise<Product> {
    await this.getById(id);
    return this.productRepo.delete(id);
  }

  // ═══════════════════════════════════════
  //  Variants
  // ═══════════════════════════════════════

  /** Добавить вариант к товару. */
  async addVariant(productId: string, data: CreateVariantData): Promise<ProductVariant> {
    await this.getById(productId);
    return this.variantRepo.create(productId, data);
  }

  /** Обновить вариант. */
  async updateVariant(id: string, data: UpdateVariantData): Promise<ProductVariant> {
    return this.variantRepo.update(id, data);
  }

  /** Удалить вариант. */
  async deleteVariant(id: string): Promise<ProductVariant> {
    return this.variantRepo.delete(id);
  }

  /** Все варианты товара. */
  async getVariants(productId: string): Promise<ProductVariant[]> {
    await this.getById(productId);
    return this.variantRepo.findByProduct(productId);
  }
}
