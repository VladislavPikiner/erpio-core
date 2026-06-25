import { z } from 'zod';

export const CreateStockMovementDto = z.object({
  inventoryId: z.string().uuid(), // ID позиции на складе, откуда/куда идет движение
  quantity: z.number().int().positive(), // Количество единиц
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER_OUT', 'TRANSFER_IN']), // Тип движения
  referenceType: z.string().optional(), // Тип документа, с которым связано движение (например, 'SALE', 'PURCHASE', 'TRANSFER')
  referenceId: z.string().uuid().optional(), // ID документа, с которым связано движение
  notes: z.string().optional(), // Дополнительные заметки
});

export type CreateStockMovementDto = z.infer<typeof CreateStockMovementDto>;
