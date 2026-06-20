import { uuidv7 } from './uuid';

/**
 * Инкремент метрики дашборда.
 * Создаёт запись `DashboardMetric`, если её нет; иначе увеличивает value.
 * Используется в AnalyticsService для живых счётчиков (today_revenue, today_orders...).
 *
 * @param prisma — экземпляр PrismaService
 * @param key — уникальный ключ метрики (например, "today_revenue")
 * @param increment — на сколько изменить value
 */
export async function incrementMetric(
  prisma: any,
  key: string,
  increment: number,
): Promise<void> {
  const existing = await prisma.dashboardMetric.findUnique({ where: { key } });
  if (existing) {
    await prisma.dashboardMetric.update({
      where: { key },
      data: { value: existing.value + increment },
    });
  } else {
    await prisma.dashboardMetric.create({
      data: { id: uuidv7(), key, value: increment },
    });
  }
}

/**
 * Построитель Prisma OR-условия для поиска по тексту в нескольких полях.
 *
 * @example
 * where.OR = buildSearchFilter(query, ['name', 'email']);
 * // → [{ name: { contains: query, mode: 'insensitive' }},
 * //    { email: { contains: query, mode: 'insensitive' }}]
 *
 * @param search — строка поиска
 * @param fields — поля модели, по которым ищем
 * @returns OR-массив для передачи в Prisma where, или undefined
 */
export function buildSearchFilter(
  search: string | undefined,
  fields: string[],
): any[] | undefined {
  if (!search?.trim()) return undefined;
  return fields.map((field) => ({
    [field]: { contains: search, mode: 'insensitive' },
  }));
}
