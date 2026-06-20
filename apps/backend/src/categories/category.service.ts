import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    if (data.parentId) {
      const parent = await this.categoryRepository.findById(data.parentId);
      if (!parent) {
        throw new BadRequestException(`Parent category with ID ${data.parentId} not found`);
      }
    }
    return this.categoryRepository.create(data);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (data.parentId && data.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    return this.categoryRepository.update(id, data);
  }

  async delete(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.categoryRepository.delete(id);
  }

  async findAll(includeInactive = false): Promise<Category[]> {
    return this.categoryRepository.findAll(includeInactive);
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async getTree(): Promise<Category[]> {
    return this.categoryRepository.getTree();
  }

  async count(): Promise<number> {
    return this.categoryRepository.count();
  }
}
