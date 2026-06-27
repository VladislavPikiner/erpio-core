import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Название категории обязательно').max(100),
  description: z.string().max(500).optional().nullable(),
  parentId: z.string().uuid('Некорректный parentId').optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
