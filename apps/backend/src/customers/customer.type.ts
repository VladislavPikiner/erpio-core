import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CustomerGroupType } from './customer-group.type';

@ObjectType()
export class CustomerType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  taxId?: string;

  @Field(() => CustomerGroupType, { nullable: true })
  group?: CustomerGroupType;

  @Field(() => Int, { description: 'Индивидуальная скидка в процентах*100 (500 = 5%)' })
  discount!: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
