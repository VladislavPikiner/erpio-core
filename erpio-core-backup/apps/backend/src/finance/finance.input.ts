import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field()
  name!: string;

  @Field()
  type!: string; // CASH | BANK | RECEIVABLE | PAYABLE | REVENUE | EXPENSE

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class CreateTransactionInput {
  @Field()
  accountId!: string;

  @Field()
  type!: string; // DEBIT | CREDIT

  @Field(() => Int)
  amount!: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  referenceType?: string;

  @Field({ nullable: true })
  referenceId?: string;
}

@InputType()
export class CreateInvoiceInput {
  @Field({ nullable: true })
  customerId?: string;

  @Field()
  dueDate!: Date;

  @Field(() => Int)
  subtotal!: number;

  @Field(() => Int, { nullable: true })
  tax?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class InvoiceFilterInput {
  @Field({ nullable: true })
  customerId?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dateFrom?: Date;

  @Field({ nullable: true })
  dateTo?: Date;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}
