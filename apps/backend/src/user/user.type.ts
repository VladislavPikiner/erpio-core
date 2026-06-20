import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: number;

  @Field()
  username!: string;

  @Field(() => [String])
  roles!: string[];
}
