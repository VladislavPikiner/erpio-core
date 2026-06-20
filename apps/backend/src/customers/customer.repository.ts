import { Injectable } from '@nestjs/common';
import { uuidv7 } from '../common/utils/uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Customer, CustomerGroup } from '@prisma/client';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.schema';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Groups ──

  async findAllGroups(): Promise<CustomerGroup[]> {
    return this.prisma.customerGroup.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findGroupById(id: string): Promise<CustomerGroup | null> {
    return this.prisma.customerGroup.findUnique({ where: { id } });
  }

  async createGroup(data: { name: string; discount?: number }): Promise<CustomerGroup> {
    return this.prisma.customerGroup.create({
      data: { id: uuidv7(), name: data.name, discount: data.discount ?? 0 },
    });
  }

  async updateGroup(id: string, data: { name?: string; discount?: number }): Promise<CustomerGroup> {
    return this.prisma.customerGroup.update({ where: { id }, data });
  }

  async deleteGroup(id: string): Promise<CustomerGroup> {
    return this.prisma.customerGroup.delete({ where: { id } });
  }

  // ── Customers ──

  async findAll(filters: {
    search?: string;
    isActive?: boolean;
    groupId?: string;
    skip?: number;
    take?: number;
  }): Promise<Customer[]> {
    const where: any = {};

    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.groupId) where.groupId = filters.groupId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ];
    }

    return this.prisma.customer.findMany({
      where,
      skip: filters.skip ?? 0,
      take: filters.take ?? 50,
      orderBy: { createdAt: 'desc' },
      include: { group: true },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: { group: true },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({ where: { email } });
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: { id: uuidv7(), ...data },
      include: { group: true },
    });
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
      include: { group: true },
    });
  }

  async delete(id: string): Promise<Customer> {
    return this.prisma.customer.delete({ where: { id } });
  }

  async count(filters: { search?: string; isActive?: boolean; groupId?: string }): Promise<number> {
    const where: any = {};
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.groupId) where.groupId = filters.groupId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ];
    }
    return this.prisma.customer.count({ where });
  }
}
