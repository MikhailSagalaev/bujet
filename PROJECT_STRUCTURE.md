# 📁 Структура проекта E-Budget Backend

## Обзор

Полная замена Collabza + Airtable + Make на self-hosted решение с NocoDB.

```
C:\projects\budjet\
│
├── 📄 Документация
│   ├── README.md                      # Основная документация
│   ├── QUICKSTART.md                  # Быстрый старт (15 минут)
│   ├── PROJECT_BRIEF.md               # Полное описание проекта
│   ├── COLLABZA_ANALYSIS.md           # Анализ работы Collabza
│   ├── PROMPT_FOR_CLAUDE.md           # Промпт для Claude
│   ├── EXAMPLES.md                    # Примеры использования API
│   ├── DEPLOYMENT_CHECKLIST.md        # Чек-лист деплоя
│   └── PROJECT_STRUCTURE.md           # Этот файл
│
├── 🔧 Конфигурация
│   ├── docker-compose.yml             # Docker Compose конфигурация
│   ├── nginx.conf                     # Nginx конфигурация
│   └── .gitignore                     # Git ignore файл
│
├── 💾 Данные (CSV из Airtable)
│   ├── Users-Grid view.csv            # Пользователи
│   ├── Курсы-Grid view.csv            # Курсы
│   └── Покупки-Grid view.csv          # Покупки
│
├── 📜 Оригинальные скрипты Collabza
│   ├── e7509dde-3bfa-44dc-b455-2465e75e6614.js  # Таблица
│   └── 5a68810f-ae08-4415-b05f-d13502f8d706.js  # Карточки
│
├── 🖥️ backend/                        # Backend API (Node.js + Express)
│   ├── routes/                        # API endpoints
│   │   ├── widget.js                  # Endpoints для виджетов
│   │   └── webhook.js                 # Webhooks от Тільды
│   │
│   ├── services/                      # Бизнес-логика
│   │   └── nocodb.js                  # Работа с NocoDB API
│   │
│   ├── utils/                         # Утилиты
│   │   └── helpers.js                 # Вспомогательные функции
│   │
│   ├── config.js                      # Конфигурация приложения
│   ├── server.js                      # Главный файл сервера
│   ├── package.json                   # NPM зависимости
│   ├── Dockerfile                     # Docker образ для API
│   └── .env.example                   # Пример .env файла
│
└── 🎨 widget/                         # Frontend виджеты
    ├── js/                            # JavaScript виджеты
    │   ├── widget-table.js            # Виджет таблицы курсов
    │   └── widget-cards.js            # Виджет карточек
    │
    └── css/                           # Стили
        └── widget.css                 # Стили виджетов
```

---

## 📄 Описание файлов

### Документация

| Файл | Описание | Для кого |
|------|----------|----------|
| **README.md** | Основная документация проекта | Разработчики |
| **QUICKSTART.md** | Быстрый старт за 15 минут | Новички |
| **PROJECT_BRIEF.md** | Полное описание с реальными данными | Все |
| **COLLABZA_ANALYSIS.md** | Детальный анализ Collabza | Разработчики |
| **PROMPT_FOR_CLAUDE.md** | Готовый промпт для AI | AI разработка |
| **EXAMPLES.md** | Примеры API запросов | Разработчики |
| **DEPLOYMENT_CHECKLIST.md** | Чек-лист для деплоя | DevOps |

### Backend (Node.js + Express)

#### Главные файлы

| Файл | Описание | Строк кода |
|------|----------|------------|
| **server.js** | Express сервер, middleware, роутинг | ~80 |
| **config.js** | Конфигурация (NocoDB, CORS, бонусы) | ~35 |
| **package.json** | NPM зависимости | ~20 |
| **Dockerfile** | Docker образ для API | ~15 |
| **.env.example** | Пример переменных окружения | ~10 |

#### Routes (API endpoints)

| Файл | Endpoints | Описание |
|------|-----------|----------|
| **widget.js** | `/api/widget/*` | Endpoints для виджетов |
| | `POST /api/widget/courses` | Список курсов |
| | `POST /api/widget/referrals` | Реферальная информация |
| | `POST /api/widget/profile` | Профиль пользователя |
| | `POST /api/widget/purchases` | История покупок |
| **webhook.js** | `/api/webhook/*` | Webhooks от Тільды |
| | `POST /api/webhook/tilda` | Обработка покупок |
| | `POST /api/webhook/tilda/signup` | Регистрация |

#### Services (Бизнес-логика)

| Файл | Методы | Описание |
|------|--------|----------|
| **nocodb.js** | 10+ методов | Работа с NocoDB API |
| | `getUserByEmail()` | Получить пользователя |
| | `getUserCourses()` | Получить курсы |
| | `createPurchase()` | Создать покупку |
| | `updateUserBonuses()` | Обновить бонусы |
| | `getUserReferrals()` | Получить рефералов |

#### Utils (Утилиты)

| Файл | Функции | Описание |
|------|---------|----------|
| **helpers.js** | 8+ функций | Вспомогательные функции |
| | `generateReferralLink()` | Генерация реферальной ссылки |
| | `generateCourseTableRow()` | HTML строка таблицы |
| | `generateReferralHTML()` | HTML реферальной информации |
| | `calculatePurchaseBonuses()` | Расчёт бонусов |

### Frontend (JS виджеты)

| Файл | Описание | Аналог Collabza |
|------|----------|-----------------|
| **widget-table.js** | Таблица курсов с пагинацией | e7509dde... |
| **widget-cards.js** | Карточки (рефералы, профиль) | 5a68810f... |
| **widget.css** | Стили для виджетов | - |

### Конфигурация

| Файл | Описание |
|------|----------|
| **docker-compose.yml** | Конфигурация всех сервисов (PostgreSQL, NocoDB, API, Nginx) |
| **nginx.conf** | Reverse proxy, раздача статики, CORS |
| **.gitignore** | Исключения для Git |

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка окружения

```bash
cp backend/.env.example backend/.env
# Отредактировать backend/.env
```

### 3. Запуск через Docker

```bash
docker-compose up -d
```

### 4. Проверка

```bash
curl http://localhost:3000/health
```

---

## 📊 Статистика проекта

### Размер кода

| Компонент | Файлов | Строк кода | Размер |
|-----------|--------|------------|--------|
| Backend | 8 | ~1200 | ~45 KB |
| Frontend | 3 | ~400 | ~15 KB |
| Конфигурация | 3 | ~200 | ~8 KB |
| Документация | 7 | ~3000 | ~120 KB |
| **Всего** | **21** | **~4800** | **~188 KB** |

### Технологии

**Backend:**
- Node.js 18+
- Express 4.18
- Axios 1.6
- CORS, Body-parser, Dotenv

**Frontend:**
- Vanilla JavaScript
- jQuery 3.6 (из Тільды)
- CSS3

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- NocoDB latest
- Nginx Alpine

---

## 🔄 Workflow разработки

### Локальная разработка

```bash
# Backend
cd backend
npm run dev

# Виджеты - просто открыть в браузере
```

### Тестирование

```bash
# Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@example.com"}'
```

### Деплой

```bash
# Сборка и запуск
docker-compose up -d --build

# Проверка логов
docker-compose logs -f

# Остановка
docker-compose down
```

---

## 📝 Следующие шаги

### Для разработки

1. ✅ Прочитать README.md
2. ✅ Запустить через QUICKSTART.md
3. ✅ Изучить EXAMPLES.md
4. ✅ Настроить .env файл
5. ✅ Запустить локально
6. ✅ Протестировать API

### Для деплоя

1. ✅ Прочитать DEPLOYMENT_CHECKLIST.md
2. ✅ Подготовить сервер
3. ✅ Настроить SSL
4. ✅ Запустить на продакшн
5. ✅ Настроить мониторинг
6. ✅ Настроить бэкапы

---

## 🆘 Помощь

### Проблемы?

1. Проверить логи: `docker-compose logs -f`
2. Проверить health check: `curl http://localhost:3000/health`
3. Проверить .env файл
4. Открыть issue на GitHub

### Контакты

- Email: support@e-budget.ru
- GitHub: https://github.com/your-repo/e-budget-backend
- Telegram: @your_support_bot

---

## 📜 Лицензия

MIT License

---

**Создано:** 20 марта 2026  
**Версия:** 1.0.0  
**Статус:** ✅ Готово к использованию
