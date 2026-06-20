import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CustomerGroupType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Int, { description: 'Скидка группы в процентах*100 (500 = 5%)' })
  discount!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
