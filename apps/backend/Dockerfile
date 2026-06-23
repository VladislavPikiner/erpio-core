# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./ 

# Устанавливаем pnpm
RUN npm install -g pnpm

# Устанавливаем зависимости проекта
RUN pnpm install

# Копируем остальной код приложения
COPY . .

# Собираем проект (NestJS генерирует JS бандл)
RUN pnpm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и pnpm-lock.yaml из build stage
COPY --from=builder /app/package*.json /app/pnpm-lock.yaml ./ 

# Устанавливаем pnpm
RUN npm install -g pnpm

# Устанавливаем продакшн зависимости
RUN pnpm install --prod

# Копируем собранный код из build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/schema.gql ./src/schema.gql
COPY --from=builder /app/logs ./logs

# Копируем файлы конфигурации, если есть (например, prisma/schema.prisma)
COPY --from=builder /app/prisma ./prisma

# Пробрасываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD [ "node", "dist/main.js" ]
