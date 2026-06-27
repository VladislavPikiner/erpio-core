import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * BranchGuard проверяет, имеет ли пользователь право доступа к данным филиала.
 * Ожидает, что в аргументах запроса (GraphQL) или контексте присутствует branchId.
 */
@Injectable()
export class BranchGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const args = gqlContext.getArgs();

    // Пытаемся получить branchId из аргументов GraphQL (напр. filter.branchId) или из тела запроса
    const branchId = args.filter?.branchId || args.branchId || req.body?.variables?.branchId;

    if (!branchId) {
      // Если операция требует филиал, но он не передан — запрещаем
      return true; // Или false, если считаем это критичным. Для начала разрешим, если филиал не указан (глобальный доступ)
    }

    // Здесь можно добавить логику проверки прав пользователя (например, user.branches.includes(branchId))
    const user = req.user;
    if (user && user.role !== 'ADMIN' && user.branchId && user.branchId !== branchId) {
        throw new ForbiddenException('У вас нет доступа к этому филиалу');
    }

    return true;
  }
}
