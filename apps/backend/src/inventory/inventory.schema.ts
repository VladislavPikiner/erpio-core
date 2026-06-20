import { z } from 'zod';

export const AdjustStockDto = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER_OUT', 'TRANSFER_IN']),
  notes: z.string().optional(),
});

export type AdjustStockDto = z.infer<typeof AdjustStockDto>;
