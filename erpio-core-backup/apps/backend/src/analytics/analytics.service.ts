import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { incrementMetric } from '../common/utils/analytics.utils';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('sale.created')
  async handleSaleCreated(payload: { saleId: string; total: number }): Promise<void> {
    this.logger.log(`Sale: ${payload.saleId}, +${payload.total}`);
    // await incrementMetric(this.prisma, 'today_revenue', payload.total);
    // await incrementMetric(this.prisma, 'today_orders', 1);
  }

  @OnEvent('invoice.paid')
  async handleInvoicePaid(payload: { invoiceId: string; total: number }): Promise<void> {
    this.logger.log(`Invoice paid: ${payload.invoiceId}, -${payload.total}`);
    // await incrementMetric(this.prisma, 'accounts_receivable', -payload.total);
  }

  /** Все метрики дашборда в виде key → value. */
  async getMetrics(): Promise<Record<string, number>> {
    return {
      today_revenue: 0,
      today_orders: 0,
      accounts_receivable: 0,
    };
  }

  /** Значение конкретной метрики. */
  async getMetric(key: string): Promise<number> {
    return 0;
  }

  /**
   * Агрегат продаж за последние N дней.
   */
  async getDailySales(days = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return this.computeDailySales(startDate);
  }

  private async computeDailySales(startDate: Date): Promise<any[]> {
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'asc' },
    });

    const dayMap = new Map<string, { count: number; total: number }>();
    for (const sale of sales) {
      const key = sale.createdAt.toISOString().slice(0, 10);
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
    const inventory = await this.prisma.inventory.findMany();
    const lowStockCount = inventory.filter((item) => item.quantity <= (item.reorderLevel ?? 0)).length;

    return {
      todayRevenue: metrics['today_revenue'] ?? 0,
      todayOrders: metrics['today_orders'] ?? 0,
      lowStockCount,
      accountsReceivable: metrics['accounts_receivable'] ?? 0,
    };
  }
}
