# Примеры использования API

## Тестирование API через curl

### 1. Health Check
```bash
curl http://localhost:3000/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T12:00:00.000Z",
  "environment": "production"
}
```

---

### 2. Получить курсы пользователя

```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru",
    "offset": 0,
    "limit": 10
  }'
```

**Ответ:**
```json
{
  "records": [
    {
      "table_content": "<tr><td>Заключение соглашений...</td><td>22 февраля 2023 г.</td><td><a href='https://e-budget.ru/page30808530.html' class='t-btn t-btn_xs' target='_blank'>Перейти к курсу</a></td></tr>"
    }
  ],
  "total": 3,
  "offset": 10
}
```

---

### 3. Получить реферальную информацию

```bash
curl -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

**Ответ:**
```json
{
  "records": [
    {
      "html": "<div class='referral-info'>...</div>"
    }
  ]
}
```

---

### 4. Получить профиль пользователя

```bash
curl -X POST http://localhost:3000/api/widget/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

---

### 5. Получить историю покупок

```bash
curl -X POST http://localhost:3000/api/widget/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru",
    "offset": 0,
    "limit": 10
  }'
```

---

### 6. Webhook от Тільды (покупка)

```bash
curl -X POST http://localhost:3000/api/webhook/tilda \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "Name": "Тестовый пользователь",
    "order_id": "1234567890",
    "payment": "Да",
    "course_id": "recc4DgQg3Q7dcuL4",
    "amount": 420
  }'
```

**Ответ:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "user_id": "recXXXXXXXXXXXXX"
}
```

---

### 7. Webhook регистрации с рефералом

```bash
curl -X POST http://localhost:3000/api/webhook/tilda/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "newuser@example.com",
    "Name": "Новый пользователь",
    "utm_source": "recbrANjcTHRMCOZO"
  }'
```

---

## Тестирование через Postman

### Импорт коллекции

Создать новую коллекцию в Postman и добавить следующие запросы:

#### 1. Health Check
- Method: GET
- URL: `http://localhost:3000/health`

#### 2. Get Courses
- Method: POST
- URL: `http://localhost:3000/api/widget/courses`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "user_email": "bazeeva@inbox.ru",
  "offset": 0,
  "limit": 10
}
```

#### 3. Get Referrals
- Method: POST
- URL: `http://localhost:3000/api/widget/referrals`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "user_email": "bazeeva@inbox.ru"
}
```

---

## Примеры интеграции с Тільдой

### Пример 1: Таблица курсов

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="https://your-domain.ru/widget/css/widget.css">
</head>
<body>
  <!-- Виджет таблицы -->
  <script src="https://your-domain.ru/widget/js/widget-table.js"></script>
  
  <!-- Блок для отображения -->
  <div id="rec543510144" class="r_hidden">
    <div class="t431">
      <div class="t431__table-wrapper">
        <table class="t431__table">
          <thead>
            <tr>
              <th>Название курса</th>
              <th>Дата покупки</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr class="t431__data-part2"></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>
```

---

### Пример 2: Реферальная программа

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="https://your-domain.ru/widget/css/widget.css">
</head>
<body>
  <!-- Виджет карточек -->
  <script src="https://your-domain.ru/widget/js/widget-cards.js"></script>
  
  <!-- Блок для отображения -->
  <div id="rec556083146" class="r_hidden">
    <div class="t123">
      <div>
        <div>
          <!-- Сюда вставится HTML -->
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

---

### Пример 3: Кастомный виджет

Создать свой виджет на основе существующих:

```javascript
(function() {
  'use strict';

  const CONFIG = {
    API_URL: 'https://your-domain.ru/api',
    BLOCK_ID: '#rec123456789',
    ENDPOINT: '/widget/custom'
  };

  $(document).ready(function() {
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) || '{}'
    );

    if (!profile.login) {
      console.error('User not logged in');
      return;
    }

    $.ajax({
      url: CONFIG.API_URL + CONFIG.ENDPOINT,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        user_email: decodeURIComponent(profile.login)
      }),
      success: function(data) {
        // Обработка данных
        console.log('Data loaded:', data);
      },
      error: function(xhr) {
        console.error('Error:', xhr);
      }
    });
  });
})();
```

---

## Примеры работы с NocoDB API напрямую

### Получить пользователя по Email

```bash
curl -X GET "http://localhost:8080/api/v1/db/data/v1/YOUR_PROJECT_ID/Users?where=(Email,eq,bazeeva@inbox.ru)" \
  -H "xc-token: YOUR_TOKEN"
```

### Создать покупку

```bash
curl -X POST "http://localhost:8080/api/v1/db/data/v1/YOUR_PROJECT_ID/Покупки" \
  -H "xc-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "order_id": "1234567890",
    "Оплата": "Да",
    "Покупатель": "recXXXXXXXXXXXXX",
    "ID курса": "recc4DgQg3Q7dcuL4",
    "Бонусы начислить": 420
  }'
```

### Обновить бонусы пользователя

```bash
curl -X PATCH "http://localhost:8080/api/v1/db/data/v1/YOUR_PROJECT_ID/Users/recXXXXXXXXXXXXX" \
  -H "xc-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Бонусы": 1150
  }'
```

---

## Примеры обработки ошибок

### Ошибка: Пользователь не найден

```json
{
  "error": true,
  "message": "User not found"
}
```

### Ошибка: Невалидный email

```json
{
  "error": true,
  "message": "Invalid email"
}
```

### Ошибка: Проблема с NocoDB

```json
{
  "error": true,
  "message": "Error getting user by email"
}
```

---

## Мониторинг и логирование

### Просмотр логов в реальном времени

```bash
# Все сервисы
docker-compose logs -f

# Только API
docker-compose logs -f api

# Последние 100 строк
docker-compose logs --tail=100 api
```

### Проверка статуса сервисов

```bash
docker-compose ps
```

### Перезапуск сервиса

```bash
# Перезапустить API
docker-compose restart api

# Перезапустить всё
docker-compose restart
```

---

## Резервное копирование

### Бэкап PostgreSQL

```bash
docker exec ebudget_postgres pg_dump -U nocouser nocodb > backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа

```bash
docker exec -i ebudget_postgres psql -U nocouser nocodb < backup_20260320.sql
```

---

## Производительность

### Проверка использования ресурсов

```bash
docker stats
```

### Оптимизация

1. Увеличить лимиты памяти в `docker-compose.yml`
2. Настроить индексы в PostgreSQL
3. Включить кэширование в Nginx
4. Использовать CDN для статики виджетов
