import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserType } from '../users.type';

@ObjectType()
export class PaginatedUsersDto {
  @Field(() => [UserType])
  users: UserType[];

  @Field(() => Int)
  totalCount: number;
}
