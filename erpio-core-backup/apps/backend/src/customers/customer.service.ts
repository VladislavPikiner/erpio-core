import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer, CustomerGroup } from '@prisma/client';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.schema';

/**
 * Сервис клиентов.
 *
 * Управление:
 * - **Группы клиентов** (скидочные группы с процентом скидки)
 * - **Клиенты** (с привязкой к группе, поиск по name/email/phone)
 */
@Injectable()
export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  // ═══════════════════════════════════════
  //  Groups
  // ═══════════════════════════════════════

  /** Все группы клиентов. */
  async getAllGroups(): Promise<CustomerGroup[]> {
    return this.repo.findAllGroups();
  }

  /** Группа по id. */
  async getGroupById(id: string): Promise<CustomerGroup> {
    const group = await this.repo.findGroupById(id);
    if (!group) throw new NotFoundException(`Группа клиентов с ID ${id} не найдена`);
    return group;
  }

  /** Создать группу. */
  async createGroup(data: { name: string; discount?: number }): Promise<CustomerGroup> {
    return this.repo.createGroup(data);
  }

  /** Обновить группу. */
  async updateGroup(
    id: string,
    data: { name?: string; discount?: number },
  ): Promise<CustomerGroup> {
    await this.getGroupById(id);
    return this.repo.updateGroup(id, data);
  }

  /** Удалить группу (клиенты группы остаются, groupId — null). */
  async deleteGroup(id: string): Promise<CustomerGroup> {
    await this.getGroupById(id);
    return this.repo.deleteGroup(id);
  }

  // ═══════════════════════════════════════
  //  Customers
  // ═══════════════════════════════════════

  /** Список клиентов с поиском и пагинацией. */
  async getAll(
    filters: {
      search?: string;
      isActive?: boolean;
      groupId?: string;
      skip?: number;
      take?: number;
    } = {},
  ): Promise<{ items: Customer[]; total: number }> {
    const [items, total] = await Promise.all([
      this.repo.findAll(filters),
      this.repo.count(filters),
    ]);
    return { items, total };
  }

  /** Клиент по id. */
  async getById(id: string): Promise<Customer> {
    const customer = await this.repo.findById(id);
    if (!customer) throw new NotFoundException(`Клиент с ID ${id} не найден`);
    return customer;
  }

  /** Создать клиента. */
  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.repo.create(data);
  }

  /** Обновить клиента. */
  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    await this.getById(id);
    return this.repo.update(id, data);
  }

  /** Удалить клиента. */
  async delete(id: string): Promise<Customer> {
    await this.getById(id);
    return this.repo.delete(id);
  }
}
