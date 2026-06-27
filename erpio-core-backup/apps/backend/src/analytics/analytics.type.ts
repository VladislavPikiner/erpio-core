import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DashboardMetricType {
  @Field(() => ID)
  id!: string;

  @Field()
  key!: string;

  @Field(() => Float)
  value!: number;

  @Field(() => String)
  metadata!: string;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class DailySalesAggregateType {
  @Field(() => ID)
  id!: string;

  @Field()
  date!: Date;

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  count!: number;

  @Field(() => Int)
  avgValue!: number;
}

@ObjectType()
export class InventoryAnalyticType {
  @Field(() => ID)
  id!: string;

  @Field()
  date!: Date;

  @Field()
  warehouseName!: string;

  @Field(() => Int)
  totalItems!: number;

  @Field(() => Int)
  totalValue!: number;

  @Field(() => Int)
  lowStockCount!: number;
}
