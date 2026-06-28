import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * BranchGuard проверяет, имеет ли пользователь право доступа к данным филиала.
 * Ожидает, что в аргументах запроса (GraphQL) или контексте присутствует branchId.
 */
@Injectable()
export class BranchGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs();

    // Пытаемся получить branchId из аргументов GraphQL (напр. filter.branchId) или из тела запроса
    const branchId = args.filter?.branchId || args.branchId || request.body?.variables?.branchId;

    if (!branchId) {
      return true; 
    }

    const user = request.user;
    if (user && user.role !== 'ADMIN' && user.branchId && user.branchId !== branchId) {
        throw new ForbiddenException('У вас нет доступа к этому филиалу');
    }

    return true;
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType<any>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }
}
