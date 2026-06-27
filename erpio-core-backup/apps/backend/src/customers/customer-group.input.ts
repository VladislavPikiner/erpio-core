import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCustomerGroupInput {
  @Field()
  name!: string;

  @Field(() => Int, { defaultValue: 0 })
  discount?: number;
}

@InputType()
export class UpdateCustomerGroupInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  discount?: number;
}
