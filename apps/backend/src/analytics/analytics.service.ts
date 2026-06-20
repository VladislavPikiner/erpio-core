import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { incrementMetric } from '../common/utils/analytics.utils';

/**
 * Сервис аналитики и реального времени.
 *
 * Слушает события бизнес-модулей через EventEmitter и обновляет:
 * - `DashboardMetric` — живые счётчики дашборда
 * - `DailySalesAggregate` — агрегаты продаж по дням
 *
 * @example
 * // Событие sale.created → обновляет today_revenue + today_orders
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('sale.created')
  async handleSaleCreated(payload: { saleId: string; total: number }): Promise<void> {
    this.logger.log(`Sale: ${payload.saleId}, +${payload.total}`);
    await incrementMetric(this.prisma, 'today_revenue', payload.total);
    await incrementMetric(this.prisma, 'today_orders', 1);
  }

  @OnEvent('invoice.paid')
  async handleInvoicePaid(payload: { invoiceId: string; total: number }): Promise<void> {
    this.logger.log(`Invoice paid: ${payload.invoiceId}, -${payload.total}`);
    await incrementMetric(this.prisma, 'accounts_receivable', -payload.total);
  }

  /** Все метрики дашборда в виде key → value. */
  async getMetrics(): Promise<Record<string, number>> {
    const metrics = await this.prisma.dashboardMetric.findMany();
    const result: Record<string, number> = {};
    for (const m of metrics) result[m.key] = m.value;
    return result;
  }

  /** Значение конкретной метрики. */
  async getMetric(key: string): Promise<number> {
    const m = await this.prisma.dashboardMetric.findUnique({ where: { key } });
    return m?.value ?? 0;
  }

  /**
   * Агрегат продаж за последние N дней.
   * Если есть готовые `DailySalesAggregate` — возвращает их.
   * Иначе вычисляет на лету из `Sale`.
   */
  async getDailySales(days = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const aggregates = await this.prisma.dailySalesAggregate.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });

    return aggregates.length > 0 ? aggregates : this.computeDailySales(startDate);
  }

  private async computeDailySales(startDate: Date): Promise<any[]> {
    const sales = await this.prisma.sale.findMany({
      where: { date: { gte: startDate }, status: { not: 'CANCELLED' } },
      orderBy: { date: 'asc' },
    });

    const dayMap = new Map<string, { count: number; total: number }>();
    for (const sale of sales) {
      const key = sale.date.toISOString().slice(0, 10);
      const entry = dayMap.get(key) || { count: 0, total: 0 };
      entry.count++;
      entry.total += sale.total;
      dayMap.set(key, entry);
    }

    return Array.from(dayMap.entries()).map(([date, d]) => ({
      date: new Date(date),
      total: d.total,
      count: d.count,
      avgValue: d.count > 0 ? Math.round(d.total / d.count) : 0,
    }));
  }

  /** Сводка метрик для дашборда администратора. */
  async getDashboardMetrics(): Promise<{
    todayRevenue: number;
    todayOrders: number;
    lowStockCount: number;
    accountsReceivable: number;
  }> {
    const metrics = await this.getMetrics();
    const stockItems = await this.prisma.stockItem.findMany();
    const lowStockCount = stockItems.filter((item) => item.quantity <= item.minStock).length;

    return {
      todayRevenue: metrics['today_revenue'] ?? 0,
      todayOrders: metrics['today_orders'] ?? 0,
      lowStockCount,
      accountsReceivable: metrics['accounts_receivable'] ?? 0,
    };
  }
}
