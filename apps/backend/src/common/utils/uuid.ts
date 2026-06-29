/**
 * Генерация UUID v7 (RFC 9562) — time-ordered UUID.
 *
 * Структура (128 бит):
 *   [0-5]  unix_ts_ms (48 бит, big-endian) — сортируемо по времени
 *   [6]    версия 7 (4 бита) + rand_a (4 бита)
 *   [7]    rand_a (8 бит)
 *   [8]    вариант RFC 4122 (2 бита) + rand_b (6 бита)
 *   [9-15] rand_b (56 бит)
 *
 * Преимущества перед uuid v4:
 *   - Time-ordered: индексы БД не фрагментируются
 *   - Можно сортировать по id — порядок создания сохраняется
 *   - Не требует координации (в отличие от serial/auto-increment)
 *
 * @returns Строка вида `0192f7a0-3b4c-7d00-b8e1-23456789abcd`
 */
export function uuidv7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Unix timestamp в миллисекундах (48 бит) → bytes[0..5] big-endian
  const ts = BigInt(Date.now());
  bytes[0] = Number((ts >> 40n) & 0xffn);
  bytes[1] = Number((ts >> 32n) & 0xffn);
  bytes[2] = Number((ts >> 24n) & 0xffn);
  bytes[3] = Number((ts >> 16n) & 0xffn);
  bytes[4] = Number((ts >> 8n) & 0xffn);
  bytes[5] = Number(ts & 0xffn);

  // Версия 7: старшие 4 бита 6-го байта = 0111
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Вариант RFC 4122: старшие 2 бита 8-го байта = 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Форматирование в UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}