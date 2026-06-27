import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  sku: z.string(),
  imageUrl: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;


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


export const PaginationParamsSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const ExtendedPaginationParamsSchema = PaginationParamsSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  priceRange: z.object({ min: z.number(), max: z.number() }).optional(),
});

export type ExtendedPaginationParams = z.infer<typeof ExtendedPaginationParamsSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};
