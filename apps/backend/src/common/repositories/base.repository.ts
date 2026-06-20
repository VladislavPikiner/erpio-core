import { NotFoundException } from '@nestjs/common';

/**
 * Абстрактный базовый репозиторий для глобальных сущностей.
 * Используется для моделей, которые не привязаны к конкретному филиалу (например, Product, Category).
 */
export abstract class BaseRepository<T> {
  constructor(protected readonly model: any) {}

  async findById(id: string | number): Promise<T> {
    const record = await this.model.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
    return record;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  } = {}): Promise<T[]> {
    const { skip, take, where, orderBy } = params;
    return this.model.findMany({ skip, take, where, orderBy });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string | number, data: any): Promise<T> {
    await this.findById(id);
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string | number): Promise<T> {
    await this.findById(id);
    return this.model.delete({ where: { id } });
  }
}

/**
 * Абстрактный репозиторий для сущностей, привязанных к филиалу.
 * Гарантирует изоляцию данных между разными филиалами.
 */
export abstract class BranchScopedRepository<T> extends BaseRepository<T> {
  constructor(model: any) {
    super(model);
  }

  /** Поиск записи с обязательной проверкой принадлежности к филиалу. */
  async findByIdScoped(id: string | number, branchId: string): Promise<T> {
    const record = await this.model.findFirst({
      where: { 
        id, 
        // Предполагаем, что у модели есть поле branchId. 
        // Если связь идет через Warehouse, наследник должен переопределить этот метод.
        branchId 
      },
    });
    if (!record) throw new NotFoundException(`Record with ID ${id} not found in branch ${branchId}`);
    return record;
  }

  /** Поиск всех записей строго в рамках одного филиала. */
  async findAllScoped(branchId: string, params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  } = {}): Promise<T[]> {
    const { skip, take, where, orderBy } = params;
    return this.model.findMany({
      skip,
      take,
      where: { ...where, branchId },
      orderBy,
    });
  }

  /** Создание записи с принудительной привязкой к филиалу. */
  async createScoped(branchId: string, data: any): Promise<T> {
    return this.model.create({
      data: { ...data, branchId },
    });
  }

  /** Обновление записи только в том случае, если она принадлежит филиалу. */
  async updateScoped(id: string | number, branchId: string, data: any): Promise<T> {
    await this.findByIdScoped(id, branchId);
    return this.model.update({
      where: { id },
      data,
    });
  }

  /** Удаление записи только в том случае, если она принадлежит филиалу. */
  async deleteScoped(id: string | number, branchId: string): Promise<T> {
    await this.findByIdScoped(id, branchId);
    return this.model.delete({ where: { id } });
  }
}
