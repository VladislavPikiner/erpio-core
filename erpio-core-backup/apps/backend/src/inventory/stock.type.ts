import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ProductType } from '../products/product.type';
import { WarehouseType } from './warehouse.type';

@ObjectType()
export class StockItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => ProductType)
  product!: ProductType;

  @Field(() => WarehouseType)
  warehouse!: WarehouseType;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int, { description: 'Минимальный остаток для алерта' })
  minStock!: number;

  @Field(() => Int)
  maxStock!: number;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class StockMovementType {
  @Field(() => ID)
  id!: string;

  @Field(() => ProductType)
  product!: ProductType;

  @Field(() => WarehouseType, { nullable: true })
  warehouse?: WarehouseType;

  @Field()
  type!: string;

  @Field(() => Int)
  quantity!: number;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;
}
