import { z } from 'zod';

export const CreateWarehouseSchema = z.object({
  name: z.string().min(1, 'Название склада обязательно').max(200),
  address: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial();

export const CreateStockMovementSchema = z.object({
  productId: z.string().uuid('Некорректный productId'),
  warehouseId: z.string().uuid('Некорректный warehouseId'),
  type: z.enum(['IN', 'OUT', 'TRANSFER']),
  quantity: z.number().int().positive('Количество должно быть положительным'),
  reference: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const UpdateStockSchema = z.object({
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type CreateStockMovementDto = z.infer<typeof CreateStockMovementSchema>;
