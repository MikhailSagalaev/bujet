# 📋 Шпаргалка E-Budget Backend

Быстрый справочник по всем командам и настройкам.

---

## 🚀 Быстрый старт

```bash
# 1. Запустить
docker-compose up -d

# 2. Открыть NocoDB
http://localhost:8080

# 3. Импортировать CSV файлы
# Users-Grid view.csv → Users
# Курсы-Grid view.csv → Курсы
# Покупки-Grid view.csv → Покупки

# 4. Получить API токен
# Settings → API Tokens → Create Token

# 5. Настроить .env
notepad backend\.env
# NOCODB_TOKEN=...
# NOCODB_PROJECT_ID=...

# 6. Перезапустить API
docker-compose restart api

# 7. Проверить
curl http://localhost:3000/health
```

---

## 🐳 Docker команды

```bash
# Запуск
docker-compose up -d                    # Запустить все сервисы
docker-compose up -d --build            # Пересобрать и запустить

# Остановка
docker-compose down                     # Остановить все
docker-compose down -v                  # Остановить и удалить volumes

# Перезапуск
docker-compose restart                  # Перезапустить все
docker-compose restart api              # Перезапустить API
docker-compose restart nocodb           # Перезапустить NocoDB

# Логи
docker-compose logs -f                  # Все логи
docker-compose logs -f api              # Логи API
docker-compose logs --tail=100 api      # Последние 100 строк

# Статус
docker-compose ps                       # Статус сервисов
docker stats                            # Использование ресурсов
```

---

## 🔧 Backend команды

```bash
# Установка
cd backend
npm install

# Запуск
npm start                               # Продакшн
npm run dev                             # Разработка (с автоперезагрузкой)

# Тестирование
npm test                                # Все тесты
npm test -- --coverage                  # С покрытием
npm test -- --watch                     # Watch mode
```

---

## 🌐 API Endpoints

### Widget Endpoints

```bash
# Список курсов
POST /api/widget/courses
{
  "user_email": "user@email.com",
  "offset": 0,
  "limit": 10
}

# Реферальная информация
POST /api/widget/referrals
{
  "user_email": "user@email.com"
}

# Профиль пользователя
POST /api/widget/profile
{
  "user_email": "user@email.com"
}

# История покупок
POST /api/widget/purchases
{
  "user_email": "user@email.com",
  "offset": 0,
  "limit": 10
}
```

### Webhook Endpoints

```bash
# Обработка покупки
POST /api/webhook/tilda
{
  "Email": "user@email.com",
  "Name": "Имя",
  "order_id": "1234567890",
  "payment": "Да",
  "course_id": "recc4DgQg3Q7dcuL4",
  "amount": 420
}

# Регистрация
POST /api/webhook/tilda/signup
{
  "Email": "user@email.com",
  "Name": "Имя",
  "utm_source": "recXXXXXXXXXXXXX"
}
```

---

## 🧪 Тестирование

```bash
# Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru","offset":0}'

# Нагрузочное тестирование
ab -n 1000 -c 10 http://localhost:3000/health
```

---

## 💾 Бэкап и восстановление

```bash
# Бэкап PostgreSQL
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup.sql

# Восстановление PostgreSQL
docker exec -i ebudget_postgres psql -U nocouser nocodb < backup.sql

# Бэкап NocoDB data
docker cp ebudget_nocodb:/usr/app/data ./nocodb_backup

# Восстановление NocoDB data
docker cp ./nocodb_backup ebudget_nocodb:/usr/app/data
docker-compose restart nocodb
```

---

## 🔍 Отладка

```bash
# Проверить статус
docker-compose ps

# Проверить логи
docker-compose logs -f api

# Проверить health check
curl http://localhost:3000/health

# Проверить .env
cat backend/.env

# Проверить сеть
docker network ls
docker network inspect ebudget_ebudget_network

# Проверить переменные окружения
docker exec ebudget_api env | grep NOCODB
```

---

## 📝 Конфигурация

### backend/.env

```env
# NocoDB
NOCODB_URL=http://nocodb:8080
NOCODB_TOKEN=your-token
NOCODB_PROJECT_ID=your-project-id

# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://e-budget.ru,http://localhost

# Bonuses
PURCHASE_BONUS=300
REFERRAL_BONUS=100
```

### widget/js/*.js

```javascript
const CONFIG = {
  API_URL: 'https://your-domain.ru/api',  // ← ИЗМЕНИТЬ
  BLOCK_ID: '#rec543510144',
  ENDPOINT: '/widget/courses'
};
```

---

## 🔗 Полезные URL

```
# Локальная разработка
NocoDB:        http://localhost:8080
API Health:    http://localhost:3000/health
Виджеты:       http://localhost/widget/
Nginx:         http://localhost

# Продакшн
NocoDB:        https://nocodb.your-domain.ru
API:           https://your-domain.ru/api
Виджеты:       https://your-domain.ru/widget/
```

---

## 🛠️ Частые проблемы

### Виджет не загружается

```bash
# 1. Проверить API
curl http://localhost:3000/health

# 2. Проверить CORS
# backend/config.js → cors.origins

# 3. Проверить API_URL в виджете
# widget/js/widget-table.js → CONFIG.API_URL

# 4. Проверить консоль браузера (F12)
```

### Ошибка "User not found"

```bash
# 1. Проверить email
# 2. Проверить что пользователь есть в NocoDB
# 3. Проверить NOCODB_TOKEN в .env
```

### PostgreSQL не запускается

```bash
# 1. Проверить логи
docker-compose logs -f postgres

# 2. Удалить volume и пересоздать
docker-compose down -v
docker-compose up -d
```

### Nginx показывает 502

```bash
# 1. Проверить что API запущен
docker-compose ps

# 2. Проверить логи API
docker-compose logs -f api

# 3. Проверить конфигурацию Nginx
docker exec ebudget_nginx nginx -t
```

---

## 📚 Документация

```
START_HERE.md              - Начните отсюда
QUICKSTART.md              - Быстрый старт (15 мин)
README.md                  - Полная документация
EXAMPLES.md                - Примеры использования
DEPLOYMENT_CHECKLIST.md    - Чек-лист деплоя
FAQ.md                     - Часто задаваемые вопросы
TESTING.md                 - Тестирование
COMMANDS.md                - Полезные команды
FILES_INDEX.md             - Индекс всех файлов
```

---

## 🎯 Быстрые ссылки

### Для новичков
1. START_HERE.md
2. QUICKSTART.md
3. FAQ.md

### Для разработчиков
1. README.md
2. EXAMPLES.md
3. TESTING.md

### Для деплоя
1. DEPLOYMENT_CHECKLIST.md
2. docker-compose.yml
3. nginx.conf

---

## 💡 Полезные алиасы

Добавить в `~/.bashrc`:

```bash
# Docker Compose
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcr='docker-compose restart'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'

# E-Budget
alias eb-logs='docker-compose logs -f api'
alias eb-restart='docker-compose restart api'
alias eb-health='curl http://localhost:3000/health'
alias eb-backup='docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup_$(date +%Y%m%d).sql'
```

---

## 🔐 Безопасность

```bash
# Изменить пароли
# 1. PostgreSQL в docker-compose.yml
# 2. JWT secret в docker-compose.yml
# 3. Пароль администратора NocoDB

# Настроить firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# SSL сертификаты
sudo certbot certonly --standalone -d your-domain.ru
```

---

## 📊 Мониторинг

```bash
# Использование ресурсов
docker stats

# Дисковое пространство
docker system df

# Логи
docker-compose logs -f

# Health checks
curl http://localhost:3000/health
curl http://localhost:8080/api/v1/health
```

---

## 🚀 Деплой на продакшн

```bash
# 1. Подготовить сервер
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh

# 2. Клонировать проект
cd /opt
git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend

# 3. Настроить .env
nano backend/.env

# 4. Запустить
docker-compose up -d

# 5. Настроить SSL
sudo certbot certonly --standalone -d your-domain.ru

# 6. Проверить
curl https://your-domain.ru/health
```

---

## 📞 Поддержка

```
Email:    support@e-budget.ru
GitHub:   https://github.com/your-repo/e-budget-backend
Telegram: @ebudget_support
```

---

**Сохраните эту шпаргалку для быстрого доступа!**

Распечатайте или добавьте в закладки.
