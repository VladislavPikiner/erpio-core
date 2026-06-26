import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class WarehouseType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  address: string | null;

  @Field()
  isActive: boolean;
}
