import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

/**
 * Сервис категорий товаров.
 *
 * Категории образуют самореференсное дерево (parent → children).
 * При удалении категории её дети переназначаются на родителя удалённой.
 */
@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  /** Все категории (с учётом includeInactive). */
  async getAll(includeInactive = false): Promise<Category[]> {
    return this.repo.findAll(includeInactive);
  }

  /** Дерево категорий (корни с детьми). */
  async getTree(): Promise<Category[]> {
    return this.repo.getTree();
  }

  /** Только корневые категории (parentId === null). */
  async getRoots(includeInactive = false): Promise<Category[]> {
    return this.repo.findRoots(includeInactive);
  }

  /** Категория по id. */
  async getById(id: string): Promise<Category> {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException(`Категория с ID ${id} не найдена`);
    return category;
  }

  /** Создать категорию (с проверкой существования родителя). */
  async create(data: CreateCategoryDto): Promise<Category> {
    if (data.parentId) {
      await this.getById(data.parentId);
    }
    return this.repo.create(data);
  }

  /** Обновить категорию. */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    await this.getById(id);
    if (data.parentId) {
      await this.getById(data.parentId);
    }
    return this.repo.update(id, data);
  }

  /**
   * Удалить категорию.
   * Дети переназначаются на родителя удалённой категории.
   */
  async delete(id: string): Promise<Category> {
    await this.getById(id);
    return this.repo.delete(id);
  }
}
