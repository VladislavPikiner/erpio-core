import { z } from 'zod';

export const SaleItemDto = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive(),
  price: z.number().int(), // в копейках
});

export const CreateSaleDto = z.object({
  customerId: z.string().uuid().optional(),
  items: z.array(SaleItemDto).min(1),
  discount: z.number().int().default(0),
  notes: z.string().optional(),
});

export type CreateSaleDto = z.infer<typeof CreateSaleDto>;
