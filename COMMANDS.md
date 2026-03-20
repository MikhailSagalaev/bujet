# 🎮 Полезные команды

## Docker Compose

### Запуск и остановка

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Перезапустить все сервисы
docker-compose restart

# Перезапустить конкретный сервис
docker-compose restart api
docker-compose restart nocodb
docker-compose restart nginx
```

### Логи

```bash
# Все логи в реальном времени
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f api
docker-compose logs -f nocodb
docker-compose logs -f postgres

# Последние 100 строк
docker-compose logs --tail=100 api
```

### Статус

```bash
# Проверить статус всех сервисов
docker-compose ps

# Проверить использование ресурсов
docker stats
```

### Пересборка

```bash
# Пересобрать и запустить
docker-compose up -d --build

# Пересобрать только API
docker-compose build api
docker-compose up -d api
```

---

## Backend (локальная разработка)

### Установка

```bash
cd backend
npm install
```

### Запуск

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Продакшн режим
npm start
```

### Тестирование

```bash
# Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru","offset":0,"limit":10}'
```

---

## NocoDB

### Доступ

```bash
# Открыть в браузере
start http://localhost:8080

# Или
open http://localhost:8080
```

### Бэкап данных

```bash
# Экспорт базы PostgreSQL
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup_$(date +%Y%m%d).sql

# Экспорт данных NocoDB
docker cp ebudget_nocodb:/usr/app/data ./nocodb_backup
```

### Восстановление

```bash
# Импорт базы PostgreSQL
docker exec -i ebudget_postgres psql -U nocouser nocodb < backup_20260320.sql

# Импорт данных NocoDB
docker cp ./nocodb_backup ebudget_nocodb:/usr/app/data
docker-compose restart nocodb
```

---

## Nginx

### Проверка конфигурации

```bash
# Проверить синтаксис nginx.conf
docker exec ebudget_nginx nginx -t

# Перезагрузить конфигурацию
docker exec ebudget_nginx nginx -s reload
```

### Логи

```bash
# Access log
docker exec ebudget_nginx tail -f /var/log/nginx/access.log

# Error log
docker exec ebudget_nginx tail -f /var/log/nginx/error.log
```

---

## PostgreSQL

### Подключение

```bash
# Подключиться к базе
docker exec -it ebudget_postgres psql -U nocouser nocodb
```

### SQL команды

```sql
-- Список таблиц
\dt

-- Описание таблицы
\d table_name

-- Выход
\q
```

### Бэкап и восстановление

```bash
# Бэкап
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup.sql

# Восстановление
docker exec -i ebudget_postgres psql -U nocouser nocodb < backup.sql

# Бэкап с сжатием
docker exec ebudget_postgres pg_dump -U nocouser nocodb | gzip > backup.sql.gz

# Восстановление из сжатого
gunzip < backup.sql.gz | docker exec -i ebudget_postgres psql -U nocouser nocodb
```

---

## Git

### Инициализация

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-repo/e-budget-backend.git
git push -u origin main
```

### Обновление

```bash
git add .
git commit -m "Update: описание изменений"
git push
```

### Клонирование на сервер

```bash
# На сервере
cd /opt
git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend
```

---

## Тестирование API

### Health Check

```bash
curl http://localhost:3000/health
```

### Получить курсы

```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru",
    "offset": 0,
    "limit": 10
  }'
```

### Получить рефералов

```bash
curl -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

### Webhook от Тільды

```bash
curl -X POST http://localhost:3000/api/webhook/tilda \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "Name": "Тест",
    "order_id": "1234567890",
    "payment": "Да",
    "course_id": "recc4DgQg3Q7dcuL4",
    "amount": 420
  }'
```

---

## Мониторинг

### Проверка доступности

```bash
# Проверить что все сервисы отвечают
curl http://localhost:3000/health
curl http://localhost:8080/api/v1/health
curl http://localhost/health
```

### Использование ресурсов

```bash
# CPU и память
docker stats

# Дисковое пространство
docker system df

# Детальная информация
docker system df -v
```

### Очистка

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Удалить всё неиспользуемое
docker system prune -a
```

---

## Деплой на продакшн

### Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Клонирование проекта

```bash
cd /opt
sudo git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend
```

### Настройка

```bash
# Создать .env
sudo nano backend/.env

# Запустить
sudo docker-compose up -d

# Проверить логи
sudo docker-compose logs -f
```

### SSL сертификаты

```bash
# Установить certbot
sudo apt install certbot -y

# Получить сертификат
sudo certbot certonly --standalone -d your-domain.ru

# Автообновление (добавить в crontab)
sudo crontab -e
# Добавить:
0 0 * * * certbot renew --quiet && docker-compose -f /opt/e-budget-backend/docker-compose.yml restart nginx
```

---

## Резервное копирование

### Автоматический бэкап

```bash
# Создать скрипт
sudo nano /opt/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Бэкап PostgreSQL
docker exec ebudget_postgres pg_dump -U nocouser nocodb > $BACKUP_DIR/db_$DATE.sql

# Бэкап NocoDB data
docker cp ebudget_nocodb:/usr/app/data $BACKUP_DIR/nocodb_$DATE

# Удалить старые бэкапы (старше 30 дней)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Сделать исполняемым
sudo chmod +x /opt/backup.sh

# Добавить в crontab (каждый день в 3:00)
sudo crontab -e
0 3 * * * /opt/backup.sh >> /var/log/backup.log 2>&1
```

### Ручной бэкап

```bash
# Запустить скрипт
sudo /opt/backup.sh

# Или вручную
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup_$(date +%Y%m%d).sql
```

---

## Обновление

### Обновление кода

```bash
# На сервере
cd /opt/e-budget-backend
sudo git pull

# Пересобрать и перезапустить
sudo docker-compose up -d --build
```

### Обновление зависимостей

```bash
# Backend
cd backend
npm update
npm audit fix

# Пересобрать Docker образ
cd ..
sudo docker-compose build api
sudo docker-compose up -d api
```

---

## Отладка

### Проверка переменных окружения

```bash
# Показать .env файл
cat backend/.env

# Проверить переменные в контейнере
docker exec ebudget_api env | grep NOCODB
```

### Проверка сети

```bash
# Проверить сеть Docker
docker network ls
docker network inspect ebudget_ebudget_network

# Проверить что контейнеры видят друг друга
docker exec ebudget_api ping nocodb
docker exec ebudget_api ping postgres
```

### Проверка портов

```bash
# Проверить открытые порты
netstat -tulpn | grep LISTEN

# Или
ss -tulpn | grep LISTEN
```

---

## Полезные алиасы

Добавить в `~/.bashrc` или `~/.zshrc`:

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
alias eb-backup='sudo /opt/backup.sh'
```

После добавления:
```bash
source ~/.bashrc
```

---

## Быстрые команды

### Полный перезапуск

```bash
docker-compose down && docker-compose up -d --build && docker-compose logs -f
```

### Проверка всего

```bash
docker-compose ps && \
curl http://localhost:3000/health && \
curl http://localhost:8080/api/v1/health
```

### Очистка и перезапуск

```bash
docker-compose down -v && \
docker system prune -f && \
docker-compose up -d --build
```

---

**Сохраните этот файл для быстрого доступа к командам!**
