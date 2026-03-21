# Скрипт для быстрой публикации на GitHub (Windows PowerShell)
# Использование: .\git-push.ps1

Write-Host "🚀 E-Budget Backend - Публикация на GitHub" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка что мы в правильной директории
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Ошибка: README.md не найден" -ForegroundColor Red
    Write-Host "Запустите скрипт из корня проекта" -ForegroundColor Red
    exit 1
}

# Шаг 1: Инициализация Git
Write-Host "📦 Шаг 1: Инициализация Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Git инициализирован" -ForegroundColor Green
} else {
    Write-Host "✅ Git уже инициализирован" -ForegroundColor Green
}
Write-Host ""

# Шаг 2: Добавление файлов
Write-Host "📝 Шаг 2: Добавление файлов..." -ForegroundColor Yellow
git add .
Write-Host "✅ Файлы добавлены" -ForegroundColor Green
Write-Host ""

# Шаг 3: Создание коммита
Write-Host "💾 Шаг 3: Создание коммита..." -ForegroundColor Yellow
git commit -m "Initial commit: E-Budget Backend v1.0.0

- Backend API (Node.js + Express)
- Frontend виджеты (JavaScript)
- Docker Compose конфигурация
- Полная документация (17 файлов)
- Готово к использованию"
Write-Host "✅ Коммит создан" -ForegroundColor Green
Write-Host ""

# Шаг 4: Запрос GitHub username
Write-Host "🔗 Шаг 4: Настройка remote..." -ForegroundColor Yellow
$GITHUB_USERNAME = Read-Host "Введите ваш GitHub username"

if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
    Write-Host "❌ Ошибка: username не может быть пустым" -ForegroundColor Red
    exit 1
}

# Проверка существует ли remote
$remoteExists = git remote | Select-String "origin"
if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' уже существует" -ForegroundColor Yellow
    $recreate = Read-Host "Удалить и создать заново? (y/n)"
    if ($recreate -eq "y") {
        git remote remove origin
        git remote add origin "https://github.com/$GITHUB_USERNAME/e-budget-backend.git"
        Write-Host "✅ Remote обновлён" -ForegroundColor Green
    }
} else {
    git remote add origin "https://github.com/$GITHUB_USERNAME/e-budget-backend.git"
    Write-Host "✅ Remote добавлен" -ForegroundColor Green
}
Write-Host ""

# Шаг 5: Переименование ветки
Write-Host "🌿 Шаг 5: Переименование ветки в main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Ветка переименована" -ForegroundColor Green
Write-Host ""

# Шаг 6: Push
Write-Host "🚀 Шаг 6: Публикация на GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  ВАЖНО: Перед пушем убедитесь что:" -ForegroundColor Yellow
Write-Host "   1. Создали репозиторий на GitHub: https://github.com/new"
Write-Host "   2. Название репозитория: e-budget-backend"
Write-Host "   3. НЕ добавляли README, .gitignore, license"
Write-Host ""
$continue = Read-Host "Репозиторий создан? Продолжить? (y/n)"

if ($continue -ne "y") {
    Write-Host "❌ Отменено" -ForegroundColor Red
    Write-Host ""
    Write-Host "Создайте репозиторий на GitHub и запустите скрипт снова"
    exit 0
}

Write-Host ""
Write-Host "Пушим на GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Успешно опубликовано!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Ваш репозиторий:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$GITHUB_USERNAME/e-budget-backend"
    Write-Host ""
    Write-Host "📝 Следующие шаги:" -ForegroundColor Yellow
    Write-Host "   1. Откройте репозиторий на GitHub"
    Write-Host "   2. Добавьте описание и topics"
    Write-Host "   3. Создайте релиз v1.0.0"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Ошибка при публикации" -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "   1. Репозиторий не создан на GitHub"
    Write-Host "   2. Неправильный username"
    Write-Host "   3. Нет прав доступа"
    Write-Host ""
    Write-Host "Решение:" -ForegroundColor Cyan
    Write-Host "   1. Создайте репозиторий: https://github.com/new"
    Write-Host "   2. Проверьте username"
    Write-Host "   3. Настройте SSH ключ (см. GIT_SETUP.md)"
}
