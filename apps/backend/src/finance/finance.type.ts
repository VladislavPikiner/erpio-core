import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CustomerType } from '../customers/customer.type';

@ObjectType()
export class AccountType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field(() => Int, { description: 'Баланс в копейках' })
  balance!: number;

  @Field()
  currency!: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class TransactionType {
  @Field(() => ID)
  id!: string;

  @Field(() => AccountType)
  account!: AccountType;

  @Field()
  type!: string;

  @Field(() => Int, { description: 'Сумма в копейках' })
  amount!: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  referenceType?: string;

  @Field({ nullable: true })
  referenceId?: string;

  @Field()
  date!: Date;

  @Field()
  createdAt!: Date;
}

@ObjectType()
export class InvoiceType {
  @Field(() => ID)
  id!: string;

  @Field()
  number!: string;

  @Field(() => CustomerType, { nullable: true })
  customer?: CustomerType;

  @Field()
  date!: Date;

  @Field()
  dueDate!: Date;

  @Field(() => Int, { description: 'Сумма до НДС, копейки' })
  subtotal!: number;

  @Field(() => Int, { description: 'НДС, копейки' })
  tax!: number;

  @Field(() => Int, { description: 'Итого с НДС, копейки' })
  total!: number;

  @Field()
  status!: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
