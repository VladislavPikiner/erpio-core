import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    
    // Имитация пользователя
    req.user = {
      username: 'adminA',
      roles: ['ADMIN'],
      branchId: 'branchA-id-dummy' // В реальности нужно достать ID из базы
    };
    return true;
  }
}
