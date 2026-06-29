import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateWarehouseInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class CreateStockMovementInput {
  @Field()
  productId!: string;

  @Field()
  warehouseId!: string;

  @Field()
  type!: string; // IN | OUT | TRANSFER

  @Field(() => Int)
  quantity!: number;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class StockFilterInput {
  @Field({ nullable: true })
  warehouseId?: string;

  @Field({ nullable: true })
  productId?: string;

  @Field({ nullable: true })
  lowStock?: boolean; // только товары ниже minStock

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}

@InputType()
export class AdjustStockInput {
  @Field()
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field()
  type!: string;

  @Field({ nullable: true })
  notes?: string;
}
