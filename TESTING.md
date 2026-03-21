# 🧪 Тестирование E-Budget Backend

## Руководство по тестированию всех компонентов системы

---

## 1. Тестирование Backend API

### 1.1 Health Check

```bash
curl http://localhost:3000/health
```

**Ожидаемый результат:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T12:00:00.000Z",
  "environment": "development"
}
```

---

### 1.2 Тест endpoint: Получить курсы пользователя

```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru",
    "offset": 0,
    "limit": 10
  }'
```

**Ожидаемый результат:**
```json
{
  "records": [
    {
      "table_content": "<tr><td>Заключение соглашений...</td>..."
    }
  ],
  "total": 3,
  "offset": 10
}
```

**Проверить:**
- ✅ Статус код 200
- ✅ Есть массив records
- ✅ HTML корректный
- ✅ Если курсов больше 10 - есть offset

---

### 1.3 Тест endpoint: Реферальная информация

```bash
curl -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

**Ожидаемый результат:**
```json
{
  "records": [
    {
      "html": "<div class='referral-info'>...</div>"
    }
  ]
}
```

**Проверить:**
- ✅ Статус код 200
- ✅ HTML содержит реферальную ссылку
- ✅ Отображается количество рефералов
- ✅ Отображается количество бонусов

---

### 1.4 Тест endpoint: Профиль пользователя

```bash
curl -X POST http://localhost:3000/api/widget/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

**Проверить:**
- ✅ Статус код 200
- ✅ Отображается имя пользователя
- ✅ Отображается тариф
- ✅ Отображается дата продления

---

### 1.5 Тест endpoint: История покупок

```bash
curl -X POST http://localhost:3000/api/widget/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru",
    "offset": 0,
    "limit": 10
  }'
```

**Проверить:**
- ✅ Статус код 200
- ✅ Список покупок
- ✅ Даты корректные
- ✅ Статусы оплаты

---

### 1.6 Тест webhook: Покупка курса

```bash
curl -X POST http://localhost:3000/api/webhook/tilda \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "Name": "Тестовый пользователь",
    "order_id": "9999999999",
    "payment": "Да",
    "course_id": "recc4DgQg3Q7dcuL4",
    "amount": 420
  }'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "user_id": "recXXXXXXXXXXXXX"
}
```

**Проверить в NocoDB:**
- ✅ Создана запись в таблице "Покупки"
- ✅ Бонусы начислены пользователю (+300)
- ✅ Если есть реферал - бонусы начислены рефералу (+100)

---

### 1.7 Тест webhook: Регистрация с рефералом

```bash
curl -X POST http://localhost:3000/api/webhook/tilda/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "newuser@example.com",
    "Name": "Новый пользователь",
    "utm_source": "recbrANjcTHRMCOZO"
  }'
```

**Проверить в NocoDB:**
- ✅ Создан новый пользователь
- ✅ Поле "Кто привёл" заполнено
- ✅ У реферала увеличился счётчик "Количество рефералов"
- ✅ Новому пользователю начислены приветственные бонусы (300)

---

### 1.8 Тест ошибок

#### Невалидный email
```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "invalid-email",
    "offset": 0
  }'
```

**Ожидаемый результат:**
```json
{
  "error": true,
  "message": "Invalid email"
}
```
Статус код: 400

#### Пользователь не найден
```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "nonexistent@example.com",
    "offset": 0
  }'
```

**Ожидаемый результат:**
```json
{
  "error": true,
  "message": "User not found"
}
```
Статус код: 404

---

## 2. Тестирование NocoDB

### 2.1 Проверка подключения

```bash
curl http://localhost:8080/api/v1/health
```

**Ожидаемый результат:**
```json
{
  "message": "OK"
}
```

---

### 2.2 Тест API: Получить пользователя

```bash
curl -X GET "http://localhost:8080/api/v1/db/data/v1/YOUR_PROJECT_ID/Users?where=(Email,eq,bazeeva@inbox.ru)" \
  -H "xc-token: YOUR_TOKEN"
```

**Проверить:**
- ✅ Статус код 200
- ✅ Возвращается пользователь
- ✅ Все поля заполнены

---

### 2.3 Тест API: Создать покупку

```bash
curl -X POST "http://localhost:8080/api/v1/db/data/v1/YOUR_PROJECT_ID/Покупки" \
  -H "xc-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "order_id": "8888888888",
    "Оплата": "Да",
    "Покупатель": "recbrANjcTHRMCOZO",
    "ID курса": "recc4DgQg3Q7dcuL4",
    "Бонусы начислить": 420
  }'
```

**Проверить:**
- ✅ Статус код 200
- ✅ Запись создана
- ✅ Связи работают

---

## 3. Тестирование виджетов

### 3.1 Подготовка тестовой страницы

Создать HTML файл `test-widget.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Тест виджетов</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link rel="stylesheet" href="http://localhost/widget/css/widget.css">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .test-section { margin: 40px 0; padding: 20px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>Тестирование виджетов E-Budget</h1>
  
  <!-- Имитация Tilda Members -->
  <script>
    // Создаём профиль пользователя в localStorage
    const profile = {
      login: "bazeeva@inbox.ru",
      name: "Альмира"
    };
    localStorage.setItem('tilda_members_profile123', JSON.stringify(profile));
    
    // Имитация Tilda
    document.write('<div id="allrecords" data-tilda-project-id="123"></div>');
  </script>
  
  <!-- Тест 1: Таблица курсов -->
  <div class="test-section">
    <h2>Тест 1: Таблица курсов</h2>
    <script src="http://localhost/widget/js/widget-table.js"></script>
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
  </div>
  
  <!-- Тест 2: Реферальная информация -->
  <div class="test-section">
    <h2>Тест 2: Реферальная информация</h2>
    <script src="http://localhost/widget/js/widget-cards.js"></script>
    <div id="rec556083146" class="r_hidden">
      <div class="t123">
        <div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

### 3.2 Открыть в браузере

```bash
# Windows
start test-widget.html

# Mac
open test-widget.html

# Linux
xdg-open test-widget.html
```

### 3.3 Проверить в консоли браузера (F12)

**Не должно быть ошибок:**
- ✅ Нет ошибок CORS
- ✅ Нет ошибок 404
- ✅ API запросы успешны (статус 200)
- ✅ Данные загружаются

**Проверить визуально:**
- ✅ Таблица курсов отображается
- ✅ Реферальная информация отображается
- ✅ Стили применены
- ✅ Кнопки работают
- ✅ Мобильная версия адаптивна

---

## 4. Интеграционное тестирование

### 4.1 Полный цикл покупки

**Шаг 1:** Создать тестового пользователя
```bash
curl -X POST http://localhost:3000/api/webhook/tilda/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "integration-test@example.com",
    "Name": "Integration Test User"
  }'
```

**Шаг 2:** Сделать покупку
```bash
curl -X POST http://localhost:3000/api/webhook/tilda \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "integration-test@example.com",
    "Name": "Integration Test User",
    "order_id": "7777777777",
    "payment": "Да",
    "course_id": "recc4DgQg3Q7dcuL4",
    "amount": 420
  }'
```

**Шаг 3:** Проверить курсы пользователя
```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "integration-test@example.com",
    "offset": 0
  }'
```

**Проверить:**
- ✅ Пользователь создан
- ✅ Покупка создана
- ✅ Бонусы начислены
- ✅ Курс отображается в списке

---

### 4.2 Полный цикл реферальной программы

**Шаг 1:** Получить реферальную ссылку
```bash
curl -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

**Шаг 2:** Зарегистрировать реферала
```bash
curl -X POST http://localhost:3000/api/webhook/tilda/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "referral-test@example.com",
    "Name": "Referral Test User",
    "utm_source": "recbrANjcTHRMCOZO"
  }'
```

**Шаг 3:** Реферал делает покупку
```bash
curl -X POST http://localhost:3000/api/webhook/tilda \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "referral-test@example.com",
    "order_id": "6666666666",
    "payment": "Да",
    "course_id": "recc4DgQg3Q7dcuL4",
    "amount": 420
  }'
```

**Шаг 4:** Проверить бонусы реферала
```bash
curl -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "bazeeva@inbox.ru"
  }'
```

**Проверить:**
- ✅ Реферал создан с привязкой
- ✅ Счётчик рефералов увеличился
- ✅ Реферал получил бонусы (+300)
- ✅ Реферер получил бонусы (+100)
- ✅ Счётчик оплативших увеличился

---

## 5. Нагрузочное тестирование

### 5.1 Установка Apache Bench

```bash
# Ubuntu/Debian
sudo apt install apache2-utils

# Mac
brew install httpd

# Windows
# Скачать с https://www.apachelounge.com/download/
```

### 5.2 Тест Health Check

```bash
ab -n 1000 -c 10 http://localhost:3000/health
```

**Проверить:**
- ✅ Все запросы успешны (100%)
- ✅ Среднее время ответа < 100ms
- ✅ Нет ошибок

### 5.3 Тест API endpoint

```bash
ab -n 100 -c 5 -p test-payload.json -T application/json \
  http://localhost:3000/api/widget/courses
```

Где `test-payload.json`:
```json
{
  "user_email": "bazeeva@inbox.ru",
  "offset": 0,
  "limit": 10
}
```

**Проверить:**
- ✅ Успешность > 95%
- ✅ Среднее время < 500ms
- ✅ Нет утечек памяти

---

## 6. Тестирование безопасности

### 6.1 SQL Injection

```bash
# Попытка SQL injection
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com OR 1=1--",
    "offset": 0
  }'
```

**Ожидаемый результат:**
- ✅ Ошибка валидации email
- ✅ Запрос не выполнен

### 6.2 XSS

```bash
# Попытка XSS
curl -X POST http://localhost:3000/api/webhook/tilda/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "Name": "<script>alert(\"XSS\")</script>"
  }'
```

**Проверить:**
- ✅ Скрипт не выполняется
- ✅ HTML экранирован

### 6.3 CORS

```bash
# Запрос с неразрешённого домена
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com"
  }'
```

**Проверить:**
- ✅ CORS заголовки корректны
- ✅ Только разрешённые домены

---

## 7. Чек-лист тестирования

### Backend API
- [ ] Health check работает
- [ ] Все endpoints отвечают
- [ ] Ошибки обрабатываются корректно
- [ ] Валидация работает
- [ ] CORS настроен
- [ ] Логирование работает

### NocoDB
- [ ] Подключение работает
- [ ] Данные импортированы
- [ ] Связи настроены
- [ ] API токен работает
- [ ] Запросы выполняются

### Виджеты
- [ ] Таблица курсов загружается
- [ ] Реферальная информация отображается
- [ ] Пагинация работает
- [ ] Стили применены
- [ ] Мобильная версия работает
- [ ] Нет ошибок в консоли

### Webhooks
- [ ] Webhook от Тільды обрабатывается
- [ ] Покупки создаются
- [ ] Бонусы начисляются
- [ ] Реферальная система работает

### Интеграция
- [ ] Полный цикл покупки работает
- [ ] Реферальная программа работает
- [ ] Данные синхронизируются

### Производительность
- [ ] Нагрузочные тесты пройдены
- [ ] Нет утечек памяти
- [ ] Время ответа приемлемо

### Безопасность
- [ ] SQL injection защита
- [ ] XSS защита
- [ ] CORS настроен
- [ ] Валидация входных данных

---

## 8. Автоматизация тестов

### 8.1 Создать скрипт тестирования

`test-all.sh`:
```bash
#!/bin/bash

echo "=== E-Budget Backend Tests ==="
echo ""

# Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s http://localhost:3000/health | jq -r '.status')
if [ "$HEALTH" = "ok" ]; then
  echo "✅ Health Check: PASSED"
else
  echo "❌ Health Check: FAILED"
  exit 1
fi

# API Endpoints
echo ""
echo "2. Testing API Endpoints..."

# Courses
COURSES=$(curl -s -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru","offset":0}' \
  | jq -r '.records | length')

if [ "$COURSES" -gt 0 ]; then
  echo "✅ Courses API: PASSED ($COURSES courses)"
else
  echo "❌ Courses API: FAILED"
  exit 1
fi

# Referrals
REFERRALS=$(curl -s -X POST http://localhost:3000/api/widget/referrals \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru"}' \
  | jq -r '.records | length')

if [ "$REFERRALS" -gt 0 ]; then
  echo "✅ Referrals API: PASSED"
else
  echo "❌ Referrals API: FAILED"
  exit 1
fi

echo ""
echo "=== All Tests Passed! ==="
```

### 8.2 Запустить тесты

```bash
chmod +x test-all.sh
./test-all.sh
```

---

**Сохраните этот файл для регулярного тестирования системы!**
