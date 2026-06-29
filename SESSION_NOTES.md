# SESSION_NOTES.md

## Итоги текущей сессии (29.06.2026)

### Что сделано
1. **Сборка большинства пакетов** (`@erpio/store`, `@erpio/shop`, `@erpio/pos`, `@erpio/backend`, `@erpio/shared`, `@repo/ui`) проходит успешно.
2. **Проблема с `@erpio/admin`:**
   - Ошибка `Cannot find module 'react-redux'` сохраняется, несмотря на удаление импортов из `providers.tsx`.
   - Next.js не находится после переустановки зависимостей (`sh: 1: next: not found`).
   - Возможная причина: автогенерация файлов или некорректная установка зависимостей.

---

## План для новой сессии

### 1. Диагностика `@erpio/admin`
- Проверить наличие **автогенерации файлов** (плагины, скрипты, которые восстанавливают `providers.tsx`).
- Проверить **конфигурацию Next.js** и убедиться, что все зависимости установлены корректно.

### 2. Полная очистка и переустановка
- Удалить `node_modules` и `.next` в корне проекта и в `@erpio/admin`.
- Переустановить зависимости:
  ```bash
  cd /var/www/templates/erpio-core && rm -rf node_modules && pnpm install
  cd /var/www/templates/erpio-core/apps/admin && rm -rf node_modules .next && pnpm install
  ```

### 3. Пересборка проекта
- Запустить сборку:
  ```bash
  cd /var/www/templates/erpio-core && pnpm build
  ```

### 4. Проверка импортов
- Убедиться, что в `providers.tsx` нет импортов `react-redux` и `../lib/store`.
- Проверить все файлы в `@erpio/admin` на наличие импортов `react-redux`:
  ```bash
  cd /var/www/templates/erpio-core/apps/admin && grep -r "react-redux" --include="*.ts" --include="*.tsx" .
  ```

---

## Дополнительные проверки
- Проверить **конфигурацию ESLint** и **TypeScript** в `@erpio/admin`.
- Убедиться, что **`package.json`** содержит все необходимые зависимости.

---

## Задачи на следующую сессию
1. **Исправить сборку `@erpio/admin`**.
2. **Проверить и стабилизировать тесты** (если они есть).
3. **Подготовить проект к деплою**.