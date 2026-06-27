import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  sku!: string;

  @Field({ nullable: true })
  barcode?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field(() => Int)
  price!: number;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  sku?: string;

  @Field({ nullable: true })
  barcode?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class ProductFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field({ nullable: true })
  branchId?: string;
}
