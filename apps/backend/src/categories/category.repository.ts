import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';
import { uuidv7 } from '../common/utils/uuid';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        parent: true,
        children: { where: includeInactive ? {} : { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findRoots(includeInactive = false): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { parentId: null, ...(includeInactive ? {} : { isActive: true }) },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: { where: includeInactive ? {} : { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async getTree(): Promise<Category[]> {
    const all = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
    });
    return all.filter((c) => !c.parentId);
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: { id: uuidv7(), ...data },
      include: { parent: true },
    });
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
      include: { parent: true, children: true },
    });
  }

  async delete(id: string): Promise<Category> {
    // Сначала переназначаем детей на родителя удаляемой категории
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (category) {
      await this.prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: category.parentId },
      });
    }
    return this.prisma.category.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.category.count({ where: { isActive: true } });
  }
}
