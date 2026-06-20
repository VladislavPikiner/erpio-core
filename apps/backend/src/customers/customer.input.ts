import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCustomerInput {
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

  @Field({ nullable: true })
  groupId?: string;

  @Field(() => Int, { nullable: true, description: 'Скидка в процентах*100' })
  discount?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateCustomerInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  taxId?: string;

  @Field({ nullable: true })
  groupId?: string;

  @Field(() => Int, { nullable: true })
  discount?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class CustomerFilterInput {
  @Field({ nullable: true })
  search?: string; // поиск по name, email, phone

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  groupId?: string;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}
