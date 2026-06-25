import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class InventoryType {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  reserved: number;

  @Field(() => Int, { nullable: true })
  reorderLevel?: number;

  @Field(() => ID)
  productId: string;

  @Field(() => ID)
  warehouseId: string;
}
