import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;

  @Field(() => CategoryType, { nullable: true })
  parent?: CategoryType;

  @Field(() => [CategoryType], { nullable: true })
  children?: CategoryType[];

  @Field(() => Int)
  sortOrder!: number;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
