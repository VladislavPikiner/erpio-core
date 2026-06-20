import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantInput {
  @Field()
  name!: string;

  @Field()
  sku!: string;

  @Field(() => Int)
  price!: number;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field(() => String, { nullable: true })
  attributes?: string;
}

@InputType()
export class UpdateProductVariantInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field(() => String, { nullable: true })
  attributes?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
