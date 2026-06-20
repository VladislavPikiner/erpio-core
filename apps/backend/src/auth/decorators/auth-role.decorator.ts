import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BranchGuard } from '../auth/guards/branch.guard';

/**
 * Кастомный декоратор для авторизации:
 * 1. Проверяет JWT токен (JwtAuthGuard)
 * 2. Проверяет роль пользователя (RolesGuard)
 * 3. Проверяет доступ к филиалу (BranchGuard)
 */
export const AuthRole = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard, BranchGuard),
  );
};
