# ❓ FAQ - Часто задаваемые вопросы

## Общие вопросы

### Q: Что это за проект?
**A:** Это полная замена иностранных сервисов (Collabza + Airtable + Make) на self-hosted решение для личных кабинетов на сайте Тільда. Вы получаете полный контроль над данными и независимость от иностранных сервисов.

### Q: Сколько времени займёт установка?
**A:** 
- Локальная установка: 15-20 минут
- Продакшн деплой: 1-2 часа (включая настройку SSL)

### Q: Нужны ли навыки программирования?
**A:** 
- Для локального запуска: минимальные (следовать инструкциям)
- Для деплоя на продакшн: базовые знания Linux и Docker
- Для доработки: знание Node.js и JavaScript

### Q: Сколько это стоит?
**A:** Проект полностью бесплатный (open-source). Вам нужно оплатить только:
- VPS сервер (~500-1000₽/месяц)
- Домен (~200-500₽/год)

---

## Установка и настройка

### Q: Какие требования к серверу?
**A:** Минимальные требования:
- 2 CPU cores
- 4 GB RAM
- 20 GB SSD
- Ubuntu 20.04+ или Debian 11+

Рекомендуемые:
- 4 CPU cores
- 8 GB RAM
- 40 GB SSD

### Q: Можно ли запустить на Windows?
**A:** Да, через Docker Desktop. Для продакшна рекомендуется Linux.

### Q: Нужен ли отдельный сервер для NocoDB?
**A:** Нет, все компоненты (PostgreSQL, NocoDB, API, Nginx) запускаются на одном сервере через Docker Compose.

### Q: Как получить API токен NocoDB?
**A:** 
1. Открыть NocoDB (http://localhost:8080)
2. Нажать на аватар (правый верхний угол)
3. Settings → API Tokens
4. Create Token
5. Скопировать токен

### Q: Где найти Project ID?
**A:** В URL браузера после открытия проекта:
```
http://localhost:8080/nc/p01234567890abcdef
                          ↑ это Project ID
```

---

## Работа с данными

### Q: Как импортировать данные из Airtable?
**A:** 
1. Экспортировать таблицы из Airtable в CSV
2. Открыть NocoDB
3. Create Table → Import from CSV
4. Загрузить CSV файлы
5. Настроить связи между таблицами

### Q: Можно ли использовать существующую PostgreSQL базу?
**A:** Да, измените `NC_DB` в `docker-compose.yml`:
```yaml
NC_DB: "postgresql://user:pass@your-host:5432/dbname"
```

### Q: Как сделать бэкап данных?
**A:** 
```bash
# Бэкап PostgreSQL
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup.sql

# Бэкап NocoDB data
docker cp ebudget_nocodb:/usr/app/data ./nocodb_backup
```

### Q: Как восстановить из бэкапа?
**A:** 
```bash
# Восстановление PostgreSQL
docker exec -i ebudget_postgres psql -U nocouser nocodb < backup.sql

# Восстановление NocoDB data
docker cp ./nocodb_backup ebudget_nocodb:/usr/app/data
docker-compose restart nocodb
```

---

## API и виджеты

### Q: Виджет не загружается, что делать?
**A:** Проверьте:
1. API сервер запущен: `curl http://localhost:3000/health`
2. CORS настроен в `backend/config.js`
3. `API_URL` в виджете указан правильно
4. Консоль браузера (F12) на ошибки
5. Пользователь авторизован в Tilda Members

### Q: Ошибка CORS, как исправить?
**A:** Добавьте ваш домен в `backend/.env`:
```env
ALLOWED_ORIGINS=https://e-budget.ru,https://your-domain.ru
```
Перезапустите API: `docker-compose restart api`

### Q: Как изменить URL API в виджетах?
**A:** Отредактируйте файлы:
- `widget/js/widget-table.js`
- `widget/js/widget-cards.js`

Измените:
```javascript
const CONFIG = {
  API_URL: 'https://your-domain.ru/api',  // ← ЗДЕСЬ
  // ...
};
```

### Q: Можно ли использовать другой порт для API?
**A:** Да, измените в `backend/.env`:
```env
PORT=3001
```
И в `docker-compose.yml`:
```yaml
ports:
  - "3001:3001"
```

---

## Webhooks и интеграция с Тільдой

### Q: Webhook не работает, что проверить?
**A:** 
1. URL webhook правильный: `https://your-domain.ru/api/webhook/tilda`
2. Endpoint доступен извне (не localhost)
3. Логи API: `docker-compose logs -f api`
4. Тестовый запрос работает (см. EXAMPLES.md)

### Q: Как протестировать webhook локально?
**A:** Используйте ngrok или localtunnel:
```bash
# ngrok
ngrok http 3000

# localtunnel
npx localtunnel --port 3000
```

### Q: Бонусы не начисляются, почему?
**A:** Проверьте:
1. Webhook обрабатывается (логи API)
2. Пользователь существует в базе
3. Поле "payment" = "Да"
4. Настройки бонусов в `.env`:
```env
PURCHASE_BONUS=300
REFERRAL_BONUS=100
```

### Q: Реферальная система не работает?
**A:** Проверьте:
1. Параметр `utm_source` передаётся при регистрации
2. Поле "Кто привёл" заполнено в таблице Users
3. Связь между таблицами настроена
4. Логи API на ошибки

---

## Производительность и масштабирование

### Q: Сколько пользователей может обслужить система?
**A:** На минимальном сервере (2 CPU, 4 GB RAM):
- До 1000 активных пользователей
- До 100 одновременных запросов

Для большей нагрузки:
- Увеличьте ресурсы сервера
- Настройте кэширование (Redis)
- Используйте CDN для статики

### Q: Как ускорить работу API?
**A:** 
1. Добавить индексы в PostgreSQL
2. Включить кэширование в Nginx
3. Использовать Redis для сессий
4. Оптимизировать запросы к NocoDB

### Q: Можно ли использовать CDN?
**A:** Да, для виджетов (JS/CSS файлов). Настройте Cloudflare или другой CDN.

---

## Безопасность

### Q: Как защитить API от атак?
**A:** 
1. Используйте HTTPS (SSL сертификаты)
2. Настройте rate limiting в Nginx
3. Используйте сильные пароли
4. Регулярно обновляйте зависимости
5. Настройте firewall (ufw)

### Q: Нужна ли авторизация для API?
**A:** API использует email пользователя из Tilda Members. Дополнительная авторизация не требуется, но можно добавить JWT токены.

### Q: Как защитить NocoDB?
**A:** 
1. Используйте сильный пароль администратора
2. Не открывайте порт 8080 наружу (только через Nginx)
3. Регулярно делайте бэкапы
4. Обновляйте NocoDB до последней версии

---

## Ошибки и отладка

### Q: Ошибка "User not found"
**A:** 
1. Проверьте email пользователя
2. Убедитесь что пользователь есть в NocoDB
3. Проверьте что email совпадает с Tilda Members

### Q: Ошибка "Error getting user by email"
**A:** 
1. Проверьте `NOCODB_TOKEN` в `.env`
2. Проверьте `NOCODB_PROJECT_ID`
3. Проверьте что NocoDB запущен
4. Проверьте логи NocoDB: `docker-compose logs -f nocodb`

### Q: Ошибка "Cannot connect to NocoDB"
**A:** 
1. Проверьте что NocoDB запущен: `docker-compose ps`
2. Проверьте `NOCODB_URL` в `.env` (должен быть `http://nocodb:8080`)
3. Проверьте сеть Docker: `docker network ls`

### Q: PostgreSQL не запускается
**A:** 
1. Проверьте логи: `docker-compose logs -f postgres`
2. Проверьте что порт 5432 свободен
3. Удалите volume и пересоздайте: `docker-compose down -v && docker-compose up -d`

### Q: Nginx показывает 502 Bad Gateway
**A:** 
1. Проверьте что API запущен: `docker-compose ps`
2. Проверьте логи API: `docker-compose logs -f api`
3. Проверьте конфигурацию Nginx: `docker exec ebudget_nginx nginx -t`

---

## Разработка и доработка

### Q: Как добавить новый API endpoint?
**A:** 
1. Добавить функцию в `backend/routes/widget.js`
2. Добавить логику в `backend/services/nocodb.js`
3. Перезапустить API: `docker-compose restart api`

### Q: Как создать новый виджет?
**A:** 
1. Создать файл `widget/js/widget-name.js`
2. Использовать шаблон из существующих виджетов
3. Подключить на странице Тільды

### Q: Как изменить логику начисления бонусов?
**A:** Отредактируйте функцию `calculatePurchaseBonuses` в `backend/utils/helpers.js`

### Q: Можно ли использовать TypeScript?
**A:** Да, но потребуется настроить сборку. Текущая версия использует vanilla JavaScript для простоты.

---

## Миграция и обновление

### Q: Как обновить проект до новой версии?
**A:** 
```bash
cd /opt/e-budget-backend
git pull
docker-compose up -d --build
```

### Q: Как мигрировать на другой сервер?
**A:** 
1. Сделать бэкап данных (PostgreSQL + NocoDB)
2. Установить проект на новом сервере
3. Восстановить данные из бэкапа
4. Обновить DNS записи

### Q: Можно ли вернуться на Collabza?
**A:** Да, данные в NocoDB можно экспортировать обратно в CSV и импортировать в Airtable.

---

## Поддержка и помощь

### Q: Где получить помощь?
**A:** 
1. Прочитать документацию (README.md, QUICKSTART.md)
2. Проверить логи: `docker-compose logs -f`
3. Открыть issue на GitHub
4. Написать на support@e-budget.ru

### Q: Как сообщить об ошибке?
**A:** Открыть issue на GitHub с описанием:
- Что делали
- Что ожидали
- Что получили
- Логи ошибки

### Q: Можно ли заказать доработку?
**A:** Да, напишите на support@e-budget.ru с описанием задачи.

---

## Лицензия и использование

### Q: Какая лицензия у проекта?
**A:** MIT License - можно использовать бесплатно, в том числе коммерчески.

### Q: Можно ли продавать этот проект?
**A:** Да, но с указанием оригинального автора (MIT License).

### Q: Нужно ли указывать авторство?
**A:** Желательно, но не обязательно (MIT License).

---

## Дополнительные возможности

### Q: Можно ли добавить email уведомления?
**A:** Да, добавьте nodemailer в backend и настройте отправку в webhook handler.

### Q: Можно ли добавить Telegram уведомления?
**A:** Да, используйте Telegram Bot API в webhook handler.

### Q: Можно ли добавить админ-панель?
**A:** NocoDB уже является админ-панелью. Для кастомной панели можно использовать React Admin или Vue Admin.

### Q: Можно ли добавить аналитику?
**A:** Да, интегрируйте Google Analytics, Yandex Metrika или используйте Grafana + Prometheus.

---

**Не нашли ответ на свой вопрос?**

Проверьте:
- README.md - полная документация
- EXAMPLES.md - примеры использования
- TESTING.md - тестирование
- COMMANDS.md - полезные команды

Или напишите на support@e-budget.ru
