import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Название товара обязательно').max(300),
  description: z.string().max(2000).optional().nullable(),
  sku: z.string().min(1, 'Артикул обязателен').max(50),
  barcode: z.string().max(50).optional().nullable(),
  unit: z.string().default('шт'),
  price: z.number().int().min(0, 'Цена не может быть отрицательной'),
  cost: z.number().int().min(0).default(0),
  categoryId: z.string().uuid().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const CreateProductVariantSchema = z.object({
  name: z.string().min(1).max(300),
  sku: z.string().min(1).max(50),
  price: z.number().int().min(0),
  cost: z.number().int().min(0).default(0),
  attributes: z.record(z.string(), z.any()).default({}),
});

export const UpdateProductVariantSchema = CreateProductVariantSchema.partial();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export type CreateProductVariantDto = z.infer<typeof CreateProductVariantSchema>;
export type UpdateProductVariantDto = z.infer<typeof UpdateProductVariantSchema>;
