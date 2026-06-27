import { Resolver, Query, Args, Float } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { DashboardMetricType, DailySalesAggregateType } from './analytics.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsResolver {
  constructor(private readonly service: AnalyticsService) {}

  @Query(() => [DashboardMetricType])
  @Roles('ADMIN', 'MANAGER')
  async dashboardMetrics() {
    const metrics = await this.service.getMetrics();
    return Object.entries(metrics).map(([key, value]) => ({
      id: key,
      key,
      value,
      metadata: '{}',
      updatedAt: new Date(),
    }));
  }

  @Query(() => [DailySalesAggregateType])
  @Roles('ADMIN', 'MANAGER')
  async dailySales(
    @Args('days', { nullable: true, defaultValue: 30 }) days: number,
  ) {
    return this.service.getDailySales(days);
  }

  @Query(() => Float)
  @Roles('ADMIN', 'MANAGER')
  async liveMetric(@Args('key') key: string) {
    return this.service.getMetric(key);
  }
}
