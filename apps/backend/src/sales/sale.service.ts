import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SaleRepository } from './sale.repository';
import { PaymentRepository } from './payment.repository';
import { Sale, Payment } from '@prisma/client';

/**
 * Сервис продаж (POS).
 *
 * Создание продаж с автогенерацией номера ORD-YYYYMMDD-NNNNNN,
 * управление статусами (DRAFT/CONFIRMED/COMPLETED/CANCELLED),
 * добавление платежей.
 *
 * События (EventEmitter):
 * - `sale.created` — аналитика обновляет метрики дашборда
 */
@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepo: SaleRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Список продаж с фильтрацией и пагинацией. */
  async getAll(
    filters: {
      search?: string;
      status?: string;
      customerId?: string;
      dateFrom?: Date;
      dateTo?: Date;
      skip?: number;
      take?: number;
    } = {},
  ): Promise<{ items: Sale[]; total: number }> {
    const [items, total] = await Promise.all([
      this.saleRepo.findAll(filters),
      this.saleRepo.count(filters),
    ]);
    return { items, total };
  }

  /** Продажа по id. */
  async getById(id: string): Promise<Sale> {
    const sale = await this.saleRepo.findById(id);
    if (!sale) throw new NotFoundException(`Продажа с ID ${id} не найдена`);
    return sale;
  }

  /**
   * Создать продажу.
   * - Генерирует номер ORD-DATE-NNNNNN
   * - Считает subtotal и total
   * - Устанавливает статус CONFIRMED
   * - Эмитит `sale.created`
   */
  async create(data: {
    customerId?: string | null;
    discount: number;
    notes?: string | null;
    items: { productId: string; quantity: number; unitPrice: number; discount?: number }[];
  }): Promise<Sale> {
    const sale = await this.saleRepo.create(data);
    this.eventEmitter.emit('sale.created', { saleId: sale.id, total: sale.total });
    return sale;
  }

  /** Отменить продажу. */
  async cancel(id: string): Promise<Sale> {
    const sale = await this.getById(id);
    if (sale.status === 'CANCELLED') {
      throw new NotFoundException('Продажа уже отменена');
    }
    return this.saleRepo.updateStatus(id, 'CANCELLED');
  }

  /** Завершить продажу. */
  async complete(id: string): Promise<Sale> {
    return this.saleRepo.updateStatus(id, 'COMPLETED');
  }

  /** Добавить платёж к продаже. */
  async addPayment(data: {
    saleId: string;
    amount: number;
    method: 'CASH' | 'CARD' | 'TRANSFER';
    reference?: string | null;
  }): Promise<Payment> {
    const sale = await this.getById(data.saleId);
    if (sale.status === 'CANCELLED') {
      throw new NotFoundException('Нельзя оплатить отменённую продажу');
    }
    return this.paymentRepo.create(data);
  }

  /** Все платежи по продаже. */
  async getPayments(saleId: string): Promise<Payment[]> {
    return this.paymentRepo.findBySaleId(saleId);
  }
}
