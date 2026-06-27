# Guide to Contributing to erpio-core 🚀

`erpio-core` — это не просто шаблон, а **Enterprise-эталон** для генерации ERP-систем. Основные принципы разработки: **детерминированность, безопасность, стабильность и масштабируемость**.

Любое изменение в проекте или генерация нового модуля через `web-cooker` должны строго соответствовать следующим стандартам.

---

## 🛠 Архитектурные Стандарты

### 1. Core Layer (Фундамент)

#### Обработка ошибок
Запрещено использовать разрозненные `try-catch` с произвольными ответами. Все ошибки должны обрабатываться через глобальный `ExceptionFilter`.
- **Стандарт ответа**: `{ success: false, error: { status, message, timestamp, path } }`.
- Используйте встроенные исключения NestJS (`BadRequestException`, `ForbiddenException` и т.д.).

#### Безопасность и Доступ (Auth & RBAC)
- **Аутентификация**: Все защищенные роуты должны использовать `JwtAuthGuard`.
- **Авторизация**: Для управления доступом используйте декоратор `@Roles('ROLE_NAME')` и `RolesGuard`.
- **Пример**:
  ```typescript
  @Get('admin-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminData() { ... }
  ```

#### Логирование
Запрещено использовать `console.log`. Используйте `LoggerService`.
- **Структура**: Логи пишутся в формате JSON в файлы `logs/error.log` и `logs/combined.log`.
- **Уровни**: `log` (info), `error`, `warn`, `debug`.

---

### 2. Data Layer (Работа с данными)

#### Валидация (Zod)
Все входящие данные (DTO) **обязательно** должны проходить валидацию через Zod. Это гарантирует, что в бизнес-логику попадают только чистые и проверенные данные.
- Создайте файл `.schema.ts` для каждой сущности.
- Применяйте `ZodValidationPipe` в контроллерах.
- **Пример**:
  ```typescript
  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() body: CreateUserDto) { ... }
  ```

#### Репозитории и Сервисы (Base Pattern)
Для исключения дублирования кода используйте паттерн базовых классов:
- **`BaseRepository<T>`**: Реализует стандартный CRUD через Prisma.
- **`BaseService<T>`**: Реализует общую бизнес-логику.
- **Специфичные модули**: Создавайте `UserRepository` $\rightarrow$ `UserService`, наследуясь от базовых классов.

---

### 3. Инфраструктура и DevOps

#### Docker
Развертывание происходит через Docker Compose. 
- Сборка осуществляется многостадийным `Dockerfile` (Build $\rightarrow$ Production).
- Окружение настраивается через `.env` файлы.
- Запуск: `docker-compose up -d`.

#### CI/CD
Каждый пуш в `main` или `master` проходит через GitHub Actions пайплайн:
`Lint` $\rightarrow$ `Test` $\rightarrow$ `Build`.
Если любой из этапов падает — мерж запрещен.

---

## 📈 Процесс добавления нового модуля

Если вам нужно добавить новый модуль (например, `Inventory`):

1. **Схема**: Опишите сущность в `schema.prisma`.
2. **Валидация**: Создайте `inventory.schema.ts` с Zod-схемами.
3. **Репозиторий**: Создайте `InventoryRepository` $\rightarrow$ наследуйте от `BaseRepository`.
4. **Сервис**: Создайте `InventoryService` $\rightarrow$ наследуйте от `BaseService`.
5. **Контроллер/Резолвер**: Реализуйте эндпоинты, применив `ZodValidationPipe` и `JwtAuthGuard`.
6. **Модуль**: Зарегистрируйте всё в `InventoryModule` и подключите к `AppModule`.

---

## 🎨 Code Style & Conventions

- **Naming**: 
  - Классы: `PascalCase` (например, `UserService`).
  - Переменные/Методы: `camelCase` (например, `getUserById`).
  - База данных (Prisma): `snake_case` для полей.
- **TypeScript**: Строгий режим (`strict: true`). Никаких `any` (используйте `unknown` или конкретные типы).
- **Git**: Четкие, описательные коммиты.

---
*Этот документ является живым. Любые улучшения в архитектуре должны отражаться здесь.*
