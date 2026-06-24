import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Warehouse as WarehouseType } from '@prisma/client';

@ObjectType()
export class Warehouse implements WarehouseType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  address?: string | null;

  @Field()
  isActive: boolean;

  @Field()
  branchId: string;
}
