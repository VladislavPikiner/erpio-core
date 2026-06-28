import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { BranchGuard } from '../guards/branch.guard';

/**
 * Кастомный декоратор для авторизации в GraphQL:
 * 1. Проверяет JWT токен (GqlAuthGuard)
 * 2. Проверяет роль пользователя (RolesGuard)
 * 3. Проверяет доступ к филиалу (BranchGuard)
 */
export const GqlAuthRole = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, RolesGuard, BranchGuard),
  );
};
