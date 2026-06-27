import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  email: z.string().email().optional().nullable(),
  roles: z.array(z.nativeEnum(UserRole)),
  branchId: z.string().uuid().optional().nullable(),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
