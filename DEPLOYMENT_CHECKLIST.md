# ✅ Чек-лист деплоя на продакшн

## Перед деплоем

### 1. Подготовка сервера
- [ ] VPS/Dedicated сервер арендован
- [ ] Ubuntu 20.04+ или Debian 11+ установлен
- [ ] Доступ по SSH настроен
- [ ] Firewall настроен (порты 80, 443, 22)
- [ ] Домен куплен и настроен (DNS A-запись)

### 2. Установка зависимостей на сервере
```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверить установку
docker --version
docker-compose --version
```

- [ ] Docker установлен
- [ ] Docker Compose установлен

---

## Деплой приложения

### 3. Загрузка кода на сервер

```bash
# На локальной машине
cd C:\projects\budjet
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-repo/e-budget-backend.git
git push -u origin main

# На сервере
cd /opt
sudo git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend
```

- [ ] Код загружен на сервер

### 4. Настройка окружения

```bash
# Создать .env файл
sudo nano backend/.env
```

Заполнить:
```env
NOCODB_URL=http://nocodb:8080
NOCODB_TOKEN=ваш-токен
NOCODB_PROJECT_ID=ваш-project-id
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://e-budget.ru
PURCHASE_BONUS=300
REFERRAL_BONUS=100
```

- [ ] .env файл создан и заполнен

### 5. Обновить конфигурацию

#### docker-compose.yml:
```yaml
# Изменить NC_PUBLIC_URL
NC_PUBLIC_URL: "https://nocodb.your-domain.ru"
```

#### nginx.conf:
```nginx
# Раскомментировать HTTPS блок
server {
    listen 443 ssl http2;
    server_name your-domain.ru;
    # ...
}
```

#### widget/js/*.js:
```javascript
// Изменить API_URL
API_URL: 'https://your-domain.ru/api'
```

- [ ] Конфигурация обновлена

---

## SSL сертификаты

### 6. Установка Let's Encrypt

```bash
# Установить certbot
sudo apt install certbot -y

# Получить сертификат
sudo certbot certonly --standalone -d your-domain.ru -d www.your-domain.ru

# Сертификаты будут в:
# /etc/letsencrypt/live/your-domain.ru/fullchain.pem
# /etc/letsencrypt/live/your-domain.ru/privkey.pem
```

### 7. Настроить автообновление сертификатов

```bash
# Добавить в crontab
sudo crontab -e

# Добавить строку:
0 0 * * * certbot renew --quiet && docker-compose -f /opt/e-budget-backend/docker-compose.yml restart nginx
```

- [ ] SSL сертификаты получены
- [ ] Автообновление настроено

---

## Запуск сервисов

### 8. Запустить Docker Compose

```bash
cd /opt/e-budget-backend
sudo docker-compose up -d
```

### 9. Проверить статус

```bash
sudo docker-compose ps
```

Все сервисы должны быть в статусе "Up":
- [ ] ebudget_postgres - Up
- [ ] ebudget_nocodb - Up
- [ ] ebudget_api - Up
- [ ] ebudget_nginx - Up

### 10. Проверить логи

```bash
sudo docker-compose logs -f
```

Не должно быть ошибок.

- [ ] Логи без ошибок

---

## Настройка NocoDB

### 11. Открыть NocoDB

Перейти: https://nocodb.your-domain.ru

- [ ] NocoDB открывается по HTTPS

### 12. Создать аккаунт и проект

1. Создать аккаунт администратора
2. Создать проект "E-Budget"
3. Импортировать CSV файлы
4. Настроить связи между таблицами
5. Получить API токен
6. Скопировать Project ID

- [ ] NocoDB настроен
- [ ] Данные импортированы
- [ ] API токен получен

### 13. Обновить .env с токеном

```bash
sudo nano backend/.env
# Вставить NOCODB_TOKEN и NOCODB_PROJECT_ID
```

```bash
sudo docker-compose restart api
```

- [ ] API токен обновлён
- [ ] API перезапущен

---

## Проверка работоспособности

### 14. Тесты API

```bash
# Health check
curl https://your-domain.ru/health

# Тест endpoint
curl -X POST https://your-domain.ru/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru","offset":0,"limit":10}'
```

- [ ] Health check работает
- [ ] API endpoints отвечают

### 15. Проверка виджетов

Открыть в браузере:
- https://your-domain.ru/widget/js/widget-table.js
- https://your-domain.ru/widget/js/widget-cards.js
- https://your-domain.ru/widget/css/widget.css

- [ ] Виджеты доступны

---

## Интеграция с Тільдой

### 16. Обновить код на Тільде

1. Открыть страницу личного кабинета
2. Изменить URL виджетов на продакшн
3. Сохранить и опубликовать

- [ ] Виджеты обновлены на Тільде

### 17. Настроить webhooks

1. Зайти в настройки формы оплаты
2. Webhook URL: `https://your-domain.ru/api/webhook/tilda`
3. События: "Успешная оплата"
4. Сохранить

- [ ] Webhooks настроены

### 18. Тестовая покупка

1. Сделать тестовую покупку
2. Проверить логи: `sudo docker-compose logs -f api`
3. Проверить что покупка появилась в NocoDB

- [ ] Тестовая покупка прошла успешно

---

## Безопасность

### 19. Настроить firewall

```bash
# Разрешить только нужные порты
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

- [ ] Firewall настроен

### 20. Изменить пароли по умолчанию

- [ ] Пароль PostgreSQL изменён
- [ ] JWT secret изменён в docker-compose.yml
- [ ] Пароль администратора NocoDB надёжный

### 21. Настроить резервное копирование

```bash
# Создать скрипт бэкапа
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

- [ ] Скрипт бэкапа создан
- [ ] Автоматический бэкап настроен

---

## Мониторинг

### 22. Настроить мониторинг

```bash
# Установить htop для мониторинга ресурсов
sudo apt install htop -y

# Проверить использование ресурсов
docker stats
```

- [ ] Мониторинг настроен

### 23. Настроить алерты (опционально)

Можно использовать:
- Uptime Robot (бесплатный мониторинг доступности)
- Grafana + Prometheus (продвинутый мониторинг)
- Telegram бот для уведомлений

- [ ] Алерты настроены (опционально)

---

## Оптимизация

### 24. Настроить кэширование

В nginx.conf уже настроено:
- Gzip сжатие
- Кэширование статики
- Оптимизация соединений

- [ ] Кэширование работает

### 25. Настроить CDN (опционально)

Для ускорения загрузки виджетов можно использовать:
- Cloudflare (бесплатный CDN)
- AWS CloudFront
- Yandex Cloud CDN

- [ ] CDN настроен (опционально)

---

## Документация

### 26. Создать документацию для команды

- [ ] README.md обновлён с продакшн URL
- [ ] Пароли сохранены в безопасном месте
- [ ] Контакты ответственных лиц записаны
- [ ] Инструкции по восстановлению созданы

---

## Финальная проверка

### 27. Полный тест системы

- [ ] Регистрация нового пользователя работает
- [ ] Авторизация работает
- [ ] Личный кабинет отображается
- [ ] Список курсов загружается
- [ ] Реферальная ссылка генерируется
- [ ] Покупка курса обрабатывается
- [ ] Бонусы начисляются
- [ ] Webhook от Тільды работает
- [ ] Email уведомления отправляются (если настроены)

### 28. Проверка производительности

```bash
# Тест нагрузки (опционально)
# Установить Apache Bench
sudo apt install apache2-utils -y

# Тест 100 запросов, 10 одновременно
ab -n 100 -c 10 https://your-domain.ru/health
```

- [ ] Производительность приемлемая

---

## Запуск в продакшн

### 29. Переключение на продакшн

1. Убедиться что всё работает
2. Сделать финальный бэкап
3. Переключить DNS на новый сервер (если нужно)
4. Мониторить логи первые 24 часа

- [ ] Система запущена в продакшн
- [ ] Мониторинг активен
- [ ] Команда уведомлена

---

## После запуска

### 30. Первые 24 часа

- [ ] Проверять логи каждые 2 часа
- [ ] Мониторить использование ресурсов
- [ ] Быть готовым к быстрому откату

### 31. Первая неделя

- [ ] Собрать обратную связь от пользователей
- [ ] Исправить найденные баги
- [ ] Оптимизировать производительность

### 32. Регулярное обслуживание

- [ ] Еженедельно проверять логи
- [ ] Ежемесячно обновлять зависимости
- [ ] Ежеквартально проверять бэкапы

---

## 🎉 Поздравляем!

Система успешно развёрнута на продакшн!

**Важные ссылки:**
- Сайт: https://e-budget.ru
- API: https://your-domain.ru/api
- NocoDB: https://nocodb.your-domain.ru
- Логи: `sudo docker-compose logs -f`

**Контакты поддержки:**
- Email: support@e-budget.ru
- Telegram: @your_support_bot
