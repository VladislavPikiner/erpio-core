#!/bin/bash

# Скрипт для клонирования шаблона erpio-core в новый проект

# Проверка аргументов
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME=$1
TEMPLATE_DIR="/var/www/templates/erpio-core"
DEST_DIR="/var/www/projects/$PROJECT_NAME"

# Клонирование шаблона
cp -r "$TEMPLATE_DIR" "$DEST_DIR"

# Обновление package.json
cd "$DEST_DIR" || exit
sed -i "s/\"name\": \"@erpio\/admin\"/\"name\": \"$PROJECT_NAME-admin\"/g" apps/admin/package.json
sed -i "s/\"name\": \"@erpio\/store\"/\"name\": \"$PROJECT_NAME-store\"/g" apps/store/package.json
sed -i "s/\"name\": \"@erpio\/backend\"/\"name\": \"$PROJECT_NAME-backend\"/g" apps/backend/package.json

# Установка зависимостей
pnpm install

# Запуск сборки
pnpm build

# Вывод информации
echo "Project $PROJECT_NAME created at $DEST_DIR"