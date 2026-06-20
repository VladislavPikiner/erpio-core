import { z } from 'zod';

/**
 * Роли пользователей ERP-системы.
 * Совпадают с UserRole enum в Prisma-схеме.
 */
export const USER_ROLES = ['ADMIN', 'MANAGER', 'CASHIER', 'WAREHOUSE'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const CreateUserSchema = z.object({
  username: z.string().min(3, 'Имя пользователя — минимум 3 символа').max(30),
  password: z.string().min(8, 'Пароль — минимум 8 символов'),
  email: z.string().email('Некорректный email'),
  role: z.enum(USER_ROLES).optional().default('MANAGER'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
