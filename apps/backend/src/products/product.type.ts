import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CategoryType } from '../categories/category.type';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  sku!: string;

  @Field({ nullable: true })
  barcode?: string;

  @Field()
  unit!: string;

  @Field(() => Int, { description: 'Цена в копейках' })
  price!: number;

  @Field(() => Int, { description: 'Себестоимость в копейках' })
  cost!: number;

  @Field(() => CategoryType, { nullable: true })
  category?: CategoryType;

  @Field({ nullable: true })
  isActive!: boolean;

  @Field({ nullable: true })
  image?: string;

  @Field(() => [ProductVariantType], { nullable: true })
  variants?: ProductVariantType[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class ProductVariantType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  sku!: string;

  @Field(() => Int, { description: 'Цена в копейках' })
  price!: number;

  @Field(() => Int, { description: 'Себестоимость в копейках' })
  cost!: number;

  @Field(() => String, { description: 'JSON-атрибуты { color, size }' })
  attributes!: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
