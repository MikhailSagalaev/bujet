# E-Budget Backend - Замена Collabza + Airtable

Самописное решение для замены иностранных сервисов (Collabza, Airtable, Make) на self-hosted альтернативу с NocoDB.

## 📋 Содержание

- [Архитектура](#архитектура)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [Использование](#использование)
- [API Endpoints](#api-endpoints)
- [Интеграция с Тільдой](#интеграция-с-тільдой)

---

## 🏗 Архитектура

```
Тільда → JS Виджет → API Сервер → NocoDB → PostgreSQL
```

**Компоненты:**
- **Backend API** (Node.js + Express) - обработка запросов от виджетов и webhooks
- **NocoDB** - UI и API для работы с базой данных
- **PostgreSQL** - хранение данных
- **JS Виджеты** - отображение данных на Тільде
- **Nginx** - reverse proxy и раздача статики

---

## 🚀 Установка

### Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)
- Git

### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend
```

### Шаг 2: Настройка окружения

```bash
# Создать .env файл
cp backend/.env.example backend/.env

# Отредактировать .env
nano backend/.env
```

### Шаг 3: Запуск через Docker Compose

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Проверить статус
docker-compose ps
```

### Шаг 4: Настройка NocoDB

1. Открыть http://localhost:8080
2. Создать аккаунт администратора
3. Создать новый проект "E-Budget"
4. Импортировать CSV файлы:
   - `Users-Grid view.csv` → таблица "Users"
   - `Курсы-Grid view.csv` → таблица "Курсы"
   - `Покупки-Grid view.csv` → таблица "Покупки"
5. Настроить связи между таблицами
6. Получить API токен: Settings → API Tokens → Create Token
7. Скопировать Project ID из URL

### Шаг 5: Обновить конфигурацию

```bash
# Добавить в backend/.env
NOCODB_TOKEN=your-api-token-here
NOCODB_PROJECT_ID=your-project-id
```

### Шаг 6: Перезапустить API

```bash
docker-compose restart api
```

---

## ⚙️ Конфигурация

### Backend (.env)

```env
# NocoDB
NOCODB_URL=http://localhost:8080
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

### Виджеты (widget/js/*.js)

Изменить `API_URL` в файлах:
- `widget/js/widget-table.js`
- `widget/js/widget-cards.js`

```javascript
const CONFIG = {
  API_URL: 'https://your-domain.ru/api',  // ← ИЗМЕНИТЬ
  // ...
};
```

---

## 📖 Использование

### Локальная разработка

```bash
# Backend
cd backend
npm install
npm run dev

# Виджеты - просто открыть в браузере
# или использовать live-server
```

### Проверка работоспособности

```bash
# Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@example.com","offset":0,"limit":10}'
```

---

## 🔌 API Endpoints

### Widget Endpoints

#### POST /api/widget/courses
Получить список курсов пользователя

**Request:**
```json
{
  "user_email": "user@email.com",
  "offset": 0,
  "limit": 10
}
```

**Response:**
```json
{
  "records": [
    {
      "table_content": "<tr><td>Курс</td><td>Дата</td><td>Ссылка</td></tr>"
    }
  ],
  "offset": 10,
  "total": 25
}
```

#### POST /api/widget/referrals
Получить реферальную информацию

**Request:**
```json
{
  "user_email": "user@email.com"
}
```

**Response:**
```json
{
  "records": [
    {
      "html": "<div>Реферальная ссылка...</div>"
    }
  ]
}
```

#### POST /api/widget/profile
Получить профиль пользователя

#### POST /api/widget/purchases
Получить историю покупок

### Webhook Endpoints

#### POST /api/webhook/tilda
Обработка покупок от Тільды

**Request:**
```json
{
  "Email": "user@email.com",
  "Name": "Имя",
  "order_id": "1234567890",
  "payment": "Да",
  "course_id": "recc4DgQg3Q7dcuL4",
  "amount": 420,
  "utm_source": "recXXXXXXXXXXXXX"
}
```

#### POST /api/webhook/tilda/signup
Обработка регистрации

---

## 🎨 Интеграция с Тільдой

### Шаг 1: Подключить виджет на странице

Добавить HTML-блок (T123) на странице:

```html
<!-- Подключаем jQuery (если ещё не подключен) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Подключаем стили -->
<link rel="stylesheet" href="https://your-domain.ru/widget/css/widget.css">

<!-- Подключаем виджет таблицы курсов -->
<script src="https://your-domain.ru/widget/js/widget-table.js"></script>

<!-- Блок для отображения (T431 - таблица) -->
<div id="rec543510144" class="r_hidden">
  <!-- Структура блока T431 -->
</div>
```

### Шаг 2: Для реферальной информации

```html
<!-- Подключаем виджет карточек -->
<script src="https://your-domain.ru/widget/js/widget-cards.js"></script>

<!-- Блок для отображения (T123) -->
<div id="rec556083146" class="r_hidden">
  <!-- Структура блока T123 -->
</div>
```

### Шаг 3: Настроить webhooks в Тільде

1. Зайти в настройки формы оплаты
2. Добавить webhook: `https://your-domain.ru/api/webhook/tilda`
3. Выбрать события: "Успешная оплата"
4. Сохранить

---

## 🔧 Разработка

### Структура проекта

```
.
├── backend/
│   ├── routes/          # API endpoints
│   ├── services/        # Бизнес-логика
│   ├── utils/           # Утилиты
│   ├── config.js        # Конфигурация
│   ├── server.js        # Главный файл
│   └── package.json
├── widget/
│   ├── js/              # JS виджеты
│   └── css/             # Стили
├── docker-compose.yml
├── nginx.conf
└── README.md
```

### Добавление нового endpoint

1. Создать функцию в `backend/routes/widget.js`
2. Добавить логику в `backend/services/nocodb.js`
3. Обновить документацию

### Создание нового виджета

1. Создать файл `widget/js/widget-name.js`
2. Использовать шаблон из существующих виджетов
3. Подключить на странице Тільды

---

## 🐛 Отладка

### Логи

```bash
# Все сервисы
docker-compose logs -f

# Только API
docker-compose logs -f api

# Только NocoDB
docker-compose logs -f nocodb
```

### Частые проблемы

**Проблема:** Виджет не загружается
- Проверить CORS в `backend/config.js`
- Проверить `API_URL` в виджете
- Открыть консоль браузера (F12)

**Проблема:** Ошибка подключения к NocoDB
- Проверить `NOCODB_TOKEN` в `.env`
- Проверить `NOCODB_PROJECT_ID`
- Проверить что NocoDB запущен: `docker-compose ps`

**Проблема:** Webhook не работает
- Проверить URL webhook в Тільде
- Проверить логи API: `docker-compose logs -f api`
- Проверить что endpoint доступен извне

---

## 📝 Лицензия

MIT

---

## 👥 Поддержка

Если возникли вопросы:
1. Проверить логи: `docker-compose logs -f`
2. Проверить health check: `curl http://localhost:3000/health`
3. Открыть issue на GitHub
