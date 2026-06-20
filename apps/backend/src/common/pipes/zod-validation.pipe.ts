import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Pipe для валидации входных данных через Zod-схемы.
 *
 * Используется в контроллерах и GraphQL-аргументах.
 * При ошибке валидации возвращает BadRequestException
 * с детализированным списком ошибок (поле + сообщение).
 *
 * @example
 * @UsePipes(new ZodValidationPipe(CreateUserSchema))
 * async createUser(@Body() dto: CreateUserDto) { ... }
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error: any) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.errors?.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  }
}
