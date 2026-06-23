import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  sku: z.string(),
});


export const UserSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
});

export type UserSession = z.infer<typeof UserSessionSchema>;


export const PaginatedResponseSchema = (dataSchema: z.ZodTypeAny) => z.object({
  data: z.array(dataSchema),
  total: z.number()
});

