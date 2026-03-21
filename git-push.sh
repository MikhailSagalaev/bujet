#!/bin/bash

# Скрипт для быстрой публикации на GitHub
# Использование: ./git-push.sh

echo "🚀 E-Budget Backend - Публикация на GitHub"
echo "=========================================="
echo ""

# Проверка что мы в правильной директории
if [ ! -f "README.md" ]; then
    echo "❌ Ошибка: README.md не найден"
    echo "Запустите скрипт из корня проекта"
    exit 1
fi

# Шаг 1: Инициализация Git
echo "📦 Шаг 1: Инициализация Git..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git инициализирован"
else
    echo "✅ Git уже инициализирован"
fi
echo ""

# Шаг 2: Добавление файлов
echo "📝 Шаг 2: Добавление файлов..."
git add .
echo "✅ Файлы добавлены"
echo ""

# Шаг 3: Создание коммита
echo "💾 Шаг 3: Создание коммита..."
git commit -m "Initial commit: E-Budget Backend v1.0.0

- Backend API (Node.js + Express)
- Frontend виджеты (JavaScript)
- Docker Compose конфигурация
- Полная документация (17 файлов)
- Готово к использованию"
echo "✅ Коммит создан"
echo ""

# Шаг 4: Запрос GitHub username
echo "🔗 Шаг 4: Настройка remote..."
read -p "Введите ваш GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Ошибка: username не может быть пустым"
    exit 1
fi

# Проверка существует ли remote
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' уже существует"
    read -p "Удалить и создать заново? (y/n): " RECREATE
    if [ "$RECREATE" = "y" ]; then
        git remote remove origin
        git remote add origin "https://github.com/$GITHUB_USERNAME/e-budget-backend.git"
        echo "✅ Remote обновлён"
    fi
else
    git remote add origin "https://github.com/$GITHUB_USERNAME/e-budget-backend.git"
    echo "✅ Remote добавлен"
fi
echo ""

# Шаг 5: Переименование ветки
echo "🌿 Шаг 5: Переименование ветки в main..."
git branch -M main
echo "✅ Ветка переименована"
echo ""

# Шаг 6: Push
echo "🚀 Шаг 6: Публикация на GitHub..."
echo ""
echo "⚠️  ВАЖНО: Перед пушем убедитесь что:"
echo "   1. Создали репозиторий на GitHub: https://github.com/new"
echo "   2. Название репозитория: e-budget-backend"
echo "   3. НЕ добавляли README, .gitignore, license"
echo ""
read -p "Репозиторий создан? Продолжить? (y/n): " CONTINUE

if [ "$CONTINUE" != "y" ]; then
    echo "❌ Отменено"
    echo ""
    echo "Создайте репозиторий на GitHub и запустите скрипт снова"
    exit 0
fi

echo ""
echo "Пушим на GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Успешно опубликовано!"
    echo ""
    echo "📍 Ваш репозиторий:"
    echo "   https://github.com/$GITHUB_USERNAME/e-budget-backend"
    echo ""
    echo "📝 Следующие шаги:"
    echo "   1. Откройте репозиторий на GitHub"
    echo "   2. Добавьте описание и topics"
    echo "   3. Создайте релиз v1.0.0"
    echo ""
else
    echo ""
    echo "❌ Ошибка при публикации"
    echo ""
    echo "Возможные причины:"
    echo "   1. Репозиторий не создан на GitHub"
    echo "   2. Неправильный username"
    echo "   3. Нет прав доступа"
    echo ""
    echo "Решение:"
    echo "   1. Создайте репозиторий: https://github.com/new"
    echo "   2. Проверьте username"
    echo "   3. Настройте SSH ключ (см. GIT_SETUP.md)"
fi
