import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CustomerType } from '../customers/customer.type';
import { ProductType } from '../products/product.type';

@ObjectType()
export class SaleType {
  @Field(() => ID)
  id!: string;

  @Field()
  number!: string;

  @Field(() => CustomerType, { nullable: true })
  customer?: CustomerType;

  @Field()
  date!: Date;

  @Field(() => Int, { description: 'Сумма до скидки, копейки' })
  subtotal!: number;

  @Field(() => Int, { description: 'Скидка, копейки' })
  discount!: number;

  @Field(() => Int, { description: 'Итого, копейки' })
  total!: number;

  @Field()
  status!: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => [SaleItemType], { nullable: true })
  items?: SaleItemType[];

  @Field(() => [PaymentType], { nullable: true })
  payments?: PaymentType[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class SaleItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => ProductType)
  product!: ProductType;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int, { description: 'Цена за единицу, копейки' })
  unitPrice!: number;

  @Field(() => Int, { description: 'Скидка на позицию, копейки' })
  discount!: number;

  @Field(() => Int, { description: 'Итого по позиции, копейки' })
  total!: number;
}

@ObjectType()
export class PaymentType {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  amount!: number;

  @Field()
  method!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  reference?: string;

  @Field()
  createdAt!: Date;
}
