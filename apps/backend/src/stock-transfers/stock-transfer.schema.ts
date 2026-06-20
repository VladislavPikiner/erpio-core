import { z } from 'zod';

export const CreateStockTransferDto = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  fromWarehouseId: z.string().uuid(),
  toWarehouseId: z.string().uuid(),
  notes: z.string().optional(),
});

export type CreateStockTransferDto = z.infer<typeof CreateStockTransferDto>;
