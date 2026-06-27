import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Warehouse } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

interface CreateWarehouseData {
  name: string;
  address?: string | null;
  isActive?: boolean;
  branchId: string;
}

interface UpdateWarehouseData {
  name?: string;
  address?: string | null;
  isActive?: boolean;
}

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Warehouse[]> {
    return this.prisma.warehouse.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string): Promise<Warehouse | null> {
    return this.prisma.warehouse.findUnique({ where: { id } });
  }

  async create(data: CreateWarehouseData): Promise<Warehouse> {
    return this.prisma.warehouse.create({
      data: { 
        id: uuidv7(), 
        name: data.name,
        address: data.address,
        isActive: data.isActive,
        branch: { connect: { id: data.branchId } }
      },
    });
  }

  async update(id: string, data: UpdateWarehouseData): Promise<Warehouse> {
    return this.prisma.warehouse.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Warehouse> {
    return this.prisma.warehouse.delete({ where: { id } });
  }
}
