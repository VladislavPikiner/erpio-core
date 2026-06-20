import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleRepository } from './sale.repository';
import { WarehouseRepository } from '../warehouses/warehouse.repository';
import { InventoryService } from '../inventory/inventory.service';
import { CreateSaleDto } from './sale.schema';
import { Sale, SaleItem, Product } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleRepository: SaleRepository,
    private readonly warehouseRepository: WarehouseRepository,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(warehouseId: string, data: CreateSaleDto): Promise<Sale> {
    // 1. Валидация: проверяем, что склад существует
    const warehouse = await this.warehouseRepository.findById(warehouseId); // Используем findById, так как здесь не нужна строгая привязка к branchId, если сервис будет вызываться из контекста branch
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    // 2. Предварительная проверка остатков и расчет суммы
    let totalAmount = 0;
    const itemsToCreate = [];

    for (const item of data.items) {
      // Находим товар и его остатки на нужном складе
      const inventory = await this.prisma.inventory.findFirst({
        where: { productId: item.productId, warehouseId: warehouseId },
        include: { product: true },
      });

      if (!inventory) {
        throw new BadRequestException(`Product ${item.productId} not found in warehouse ${warehouseId}`);
      }

      // Проверяем достаточность остатков
      if (inventory.quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId} in warehouse ${warehouseId}. Available: ${inventory.quantity}, Requested: ${item.quantity}`);
      }

      // Расчет суммы позиции (цена * количество - скидка)
      const itemTotal = item.price * item.quantity - item.discount;
      totalAmount += itemTotal;

      itemsToCreate.push({
        ...item,
        total: itemTotal,
      });
    }

    // Добавляем общую скидку к итоговой сумме
    const finalTotalAmount = totalAmount - data.discount;

    // 3. Транзакция: создание Sale, SaleItems и списание остатков
    return this.prisma.$transaction(async (tx) => {
      // Создаем запись Sale
      const sale = await tx.sale.create({
        data: {
          warehouseId,
          customerId: data.customerId,
          total: finalTotalAmount,
          discount: data.discount,
          status: 'CONFIRMED',
          notes: data.notes,
          items: {
            create: itemsToCreate.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              total: item.total,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
          warehouse: { include: { branch: true } }, 
        },
      });

      // Списываем остатки и записываем движения
      for (const item of sale.items) {
        await this.inventoryService.adjustStock(warehouseId, {
          productId: item.productId,
          quantity: -item.quantity, // Списываем
          type: 'OUT',
          notes: `Sale ${sale.number}`,
        });
      }

      return sale;
    });
  }

  async findById(id: string, warehouseId: string): Promise<Sale> {
     return this.saleRepository.findByIdScoped(id, warehouseId);
  }

  async findAll(warehouseId: string, params?: any): Promise<Sale[]> {
    return this.saleRepository.findAllScoped(warehouseId, params);
  }
}
