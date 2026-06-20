import { z } from 'zod';

export const CreateWarehouseDto = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseDto>;

export const UpdateWarehouseDto = CreateWarehouseDto.partial();
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseDto>;
