# План Observability: Enterprise-ready Open Source Stack

1. **Базовая живучесть (Healthchecks)**
   - Внедрение `@nestjs/terminus` в `apps/backend`.
   - Создание эндпоинта `/health` (проверка БД + процесс).
   - Подготовка к интеграции с Uptime Kuma.

2. **Error Tracking (Self-hosted)**
   - Развертывание **GlitchTip** (Sentry-compatible).
   - Интеграция SDK в `packages/shared` (ErrorBoundary, ToastProvider).

3. **Метрики (Metrics & Dashboards)**
   - Настройка Prometheus (метрики NestJS).
   - Визуализация в Grafana.

---
## Статус: В работе (Этап 1)
