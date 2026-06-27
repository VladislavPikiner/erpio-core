import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateSaleItemInput {
  @Field()
  productId!: string;

  @Field({ nullable: true })
  variantId?: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int)
  unitPrice!: number;

  @Field(() => Int, { nullable: true })
  discount?: number;
}

@InputType()
export class CreateSaleInput {
  @Field({ nullable: true })
  customerId?: string;

  @Field(() => [CreateSaleItemInput])
  items!: CreateSaleItemInput[];

  @Field(() => Int, { description: 'Скидка на всю продажу, копейки' })
  discount!: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class CreatePaymentInput {
  @Field()
  saleId!: string;

  @Field(() => Int)
  amount!: number;

  @Field()
  method!: string; // CASH | CARD | TRANSFER

  @Field({ nullable: true })
  reference?: string;
}

@InputType()
export class SaleFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  customerId?: string;

  @Field({ nullable: true })
  dateFrom?: Date;

  @Field({ nullable: true })
  dateTo?: Date;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}
