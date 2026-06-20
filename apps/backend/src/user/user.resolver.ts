import { Resolver, Query } from '@nestjs/graphql';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  @Query(() => UserType)
  async me() {
    return { 
      id: 1, 
      username: 'test-user', 
      roles: ['USER'] 
    };
  }
}
