import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  email: string | null;

  @Field(() => [String])
  roles: string[];

  @Field()
  isActive: boolean;
}
