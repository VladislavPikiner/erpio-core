import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountRepository } from './account.repository';
import { TransactionRepository } from './transaction.repository';
import { InvoiceRepository } from './invoice.repository';
import { Account, Transaction, Invoice } from '@prisma/client';

/**
 * Сервис модуля «Финансы».
 *
 * Управление:
 * - **Счета** (касса, банк, доходы, расходы)
 * - **Проводки** (дебет/кредит с атомарным обновлением баланса)
 * - **Счета-фактуры** (с НДС, сроками, жизненным циклом DRAFT→SENT→PAID)
 *
 * События (EventEmitter):
 * - `invoice.paid` — при оплате счёта (обрабатывается AnalyticsService)
 */
@Injectable()
export class FinanceService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly transactionRepo: TransactionRepository,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ═══════════════════════════════════════
  //  Accounts
  // ═══════════════════════════════════════

  /** Все счета, отсортированные по имени. */
  async getAllAccounts(): Promise<Account[]> {
    return this.accountRepo.findAll();
  }

  /** Найти счёт по id. */
  async getAccountById(id: string): Promise<Account> {
    const acc = await this.accountRepo.findById(id);
    if (!acc) throw new NotFoundException(`Счёт с ID ${id} не найден`);
    return acc;
  }

  /** Создать новый счёт. */
  async createAccount(data: {
    name: string;
    type: string;
    currency?: string;
    isActive?: boolean;
  }): Promise<Account> {
    return this.accountRepo.create(data);
  }

  /** Обновить счёт. */
  async updateAccount(
    id: string,
    data: { name?: string; type?: string; currency?: string; isActive?: boolean },
  ): Promise<Account> {
    await this.getAccountById(id);
    return this.accountRepo.update(id, data);
  }

  // ═══════════════════════════════════════
  //  Transactions
  // ═══════════════════════════════════════

  /**
   * Создать проводку и атомарно обновить баланс счёта.
   * DEBIT = приход (+), CREDIT = расход (-).
   */
  async createTransaction(data: {
    accountId: string;
    type: 'DEBIT' | 'CREDIT';
    amount: number;
    description?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
  }): Promise<Transaction> {
    await this.getAccountById(data.accountId);
    return this.transactionRepo.create(data);
  }

  /** Все проводки (по счёту, если указан). */
  async getTransactions(accountId?: string, limit = 50): Promise<Transaction[]> {
    return this.transactionRepo.findAll(accountId, limit);
  }

  // ═══════════════════════════════════════
  //  Invoices
  // ═══════════════════════════════════════

  /** Список счетов с фильтрацией и пагинацией. */
  async getAllInvoices(filters: {
    customerId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    skip?: number;
    take?: number;
  }): Promise<{ items: Invoice[]; total: number }> {
    const [items, total] = await Promise.all([
      this.invoiceRepo.findAll(filters),
      this.invoiceRepo.count(filters),
    ]);
    return { items, total };
  }

  /** Найти счёт по id. */
  async getInvoiceById(id: string): Promise<Invoice> {
    const inv = await this.invoiceRepo.findById(id);
    if (!inv) throw new NotFoundException(`Счёт с ID ${id} не найден`);
    return inv;
  }

  /** Создать новый счёт (статус DRAFT, номер INV-YYYY-NNNNN). */
  async createInvoice(data: {
    customerId?: string | null;
    dueDate: Date;
    subtotal: number;
    tax?: number;
    notes?: string | null;
  }): Promise<Invoice> {
    return this.invoiceRepo.create({ ...data, tax: data.tax ?? 0 });
  }

  /** Обновить статус счёта. */
  async updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
    await this.getInvoiceById(id);
    return this.invoiceRepo.updateStatus(id, status);
  }

  /**
   * Отметить счёт оплаченным.
   * Эмитит событие `invoice.paid` для аналитики.
   */
  async markInvoicePaid(id: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    if (invoice.status === 'PAID') {
      throw new NotFoundException('Счёт уже оплачен');
    }
    const updated = await this.invoiceRepo.updateStatus(id, 'PAID');
    this.eventEmitter.emit('invoice.paid', { invoiceId: id, total: invoice.total });
    return updated;
  }
}
