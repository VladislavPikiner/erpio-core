import { z } from 'zod';

export const CreateCustomerGroupSchema = z.object({
  name: z.string().min(1, 'Название группы обязательно').max(100),
  discount: z.number().int().min(0).max(10000).default(0),
});

export const UpdateCustomerGroupSchema = CreateCustomerGroupSchema.partial();

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, 'Имя клиента обязательно').max(200),
  email: z.string().email('Некорректный email').optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  taxId: z.string().max(50).optional().nullable(),
  groupId: z.string().uuid('Некорректный groupId').optional().nullable(),
  discount: z.number().int().min(0).max(10000).default(0),
  notes: z.string().max(2000).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
