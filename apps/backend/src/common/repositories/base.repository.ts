import { NotFoundException } from '@nestjs/common';
import { uuidv7 } from '../utils/uuid';

/**
 * Абстрактный базовый репозиторий с CRUD-операциями.
 *
 * Все id генерируются как UUID v7 (time-ordered) для
 * минимальной фрагментации индексов в PostgreSQL.
 *
 * @example
 * class UserRepository extends BaseRepository<User> {
 *   constructor(prisma: PrismaService) {
 *     super(prisma.user);
 *   }
 * }
 */
export abstract class BaseRepository<T> {
  constructor(protected readonly model: any) {}

  /** Найти запись по id. Бросает NotFoundException, если нет. */
  async findById(id: string | number): Promise<T> {
    const record = await this.model.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
    return record;
  }

  /** Список записей с пагинацией и фильтрацией. */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  } = {}): Promise<T[]> {
    const { skip, take, where, orderBy } = params;
    return this.model.findMany({ skip, take, where, orderBy });
  }

  /** Создать запись с автогенерацией uuid v7. */
  async create(data: any): Promise<T> {
    return this.model.create({ data: { id: uuidv7(), ...data } });
  }

  /** Обновить запись. */
  async update(id: string | number, data: any): Promise<T> {
    await this.findById(id);
    return this.model.update({ where: { id }, data });
  }

  /** Удалить запись. */
  async delete(id: string | number): Promise<T> {
    await this.findById(id);
    return this.model.delete({ where: { id } });
  }
}
