import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => [String])
  roles: string[];

  @Field(() => Boolean)
  isActive: boolean;
}
