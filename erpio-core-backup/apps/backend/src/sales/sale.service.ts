import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleRepository } from './sale.repository';
import { WarehouseRepository } from '../warehouses/warehouse.repository';
import { InventoryService } from '../inventory/inventory.service';
import { CreateSaleDto } from './sale.schema';
import { Sale, SaleItem, Product, Payment } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleRepository: SaleRepository,
    private readonly warehouseRepository: WarehouseRepository,
    private readonly inventoryService: InventoryService,
  ) {}

  /** Создать новую продажу */
  async create(warehouseId: string, data: CreateSaleDto): Promise<Sale> {
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    let totalAmount = 0;
    const itemsToCreate: any[] = [];

    for (const item of data.items) {
      const inventory = await this.prisma.inventory.findFirst({
        where: { productId: item.productId, warehouseId: warehouseId },
        include: { product: true },
      });

      if (!inventory) {
        throw new BadRequestException(`Product ${item.productId} not found in warehouse ${warehouseId}`);
      }

      if (inventory.quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}. Available: ${inventory.quantity}`);
      }

      const itemTotal = item.price * item.quantity - (item.discount ?? 0);
      totalAmount += itemTotal;

      itemsToCreate.push({
        productId: item.productId ?? '',
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount ?? 0,
        total: itemTotal,
      });
    }

    const finalTotalAmount = totalAmount - data.discount;
    const saleNumber = `SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          number: saleNumber,
          warehouseId,
          customerId: data.customerId,
          total: finalTotalAmount,
          discount: data.discount,
          status: 'CONFIRMED',
          notes: data.notes,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: true,
          customer: true,
          warehouse: { include: { branch: true } }, 
        },
      });

      for (const item of sale.items) {
        await this.inventoryService.adjustStock(warehouseId, {
          productId: item.productId ?? '',
          quantity: -item.quantity,
          type: 'OUT',
          notes: `Sale ${sale.number}`,
        });
      }

      return sale;
    });
  }

  /** Получить все продажи с фильтрацией */
  async getAll(filter: any = {}): Promise<{ items: Sale[], total: number }> {
    const warehouseId = filter.warehouseId || (await this.warehouseRepository.findAll())[0]?.id;
    
    const [items, total] = await Promise.all([
      this.saleRepository.findAllScoped(warehouseId, filter),
      this.prisma.sale.count({ where: { warehouseId } })
    ]);

    return { items, total };
  }

  /** Получить одну продажу по ID */
  async getById(id: string): Promise<Sale> {
    const warehouseId = (await this.prisma.sale.findUnique({ where: { id } }))?.warehouseId;
    if (!warehouseId) throw new NotFoundException(`Sale ${id} not found`);
    
    return this.saleRepository.findByIdScoped(id, warehouseId);
  }

  /** Отменить продажу (возврат товаров на склад) */
  async cancel(id: string): Promise<Sale> {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({ 
        where: { id }, 
        include: { items: true } 
      });

      if (!sale) throw new NotFoundException(`Sale ${id} not found`);
      if (sale.status === 'CANCELLED') throw new BadRequestException('Sale is already cancelled');

      for (const item of sale.items) {
        await this.inventoryService.adjustStock(sale.warehouseId, {
          productId: item.productId ?? '',
          quantity: item.quantity,
          type: 'IN',
          notes: `Return from cancelled sale ${sale.number}`,
        });
      }

      return tx.sale.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    });
  }

  /** Завершить продажу (например, после оплаты) */
  async complete(id: string): Promise<Sale> {
    return this.prisma.sale.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  /** Добавить платеж к продаже */
  async addPayment(data: { saleId: string, amount: number, method: string, reference?: string }): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        saleId: data.saleId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        status: 'COMPLETED',
      },
    });
  }

  /** Получить все платежи по продаже */
  async getPayments(saleId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { saleId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string, warehouseId: string): Promise<Sale> {
     return this.saleRepository.findByIdScoped(id, warehouseId);
  }

  async findAll(warehouseId: string, params?: any): Promise<Sale[]> {
    return this.saleRepository.findAllScoped(warehouseId, params);
  }
}
