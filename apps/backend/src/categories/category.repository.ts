import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.category);
  }

  async findAll(includeInactive = false): Promise<Category[]> {
    return this.model.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        parent: true,
        children: { where: includeInactive ? {} : { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findRoots(includeInactive = false): Promise<Category[]> {
    return this.model.findMany({
      where: { parentId: null, ...(includeInactive ? {} : { isActive: true }) },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: { where: includeInactive ? {} : { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async getTree(): Promise<Category[]> {
    const all = await this.model.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { children: { orderBy: 'asc' } },
    });
    return all.filter((c: Category) => !c.parentId);
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.model.create({
      data,
      include: { parent: true },
    });
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.model.update({
      where: { id },
      data,
      include: { parent: true, children: true },
    });
  }

  async delete(id: string): Promise<Category> {
    const category = await this.model.findUnique({ where: { id } });
    if (category) {
      await this.prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: category.parentId },
      });
    }
    return this.model.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.model.count({ where: { isActive: true } });
  }
}
