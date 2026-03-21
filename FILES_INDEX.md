# 📑 Индекс всех файлов проекта

Полный список всех файлов с описанием их назначения.

---

## 📄 Документация (21 файл)

| Файл | Описание | Для кого | Приоритет |
|------|----------|----------|-----------|
| **START_HERE.md** | 👈 Точка входа в проект | Все | ⭐⭐⭐ |
| **PUBLISH_NOW.md** | 🚀 Опубликовать на GitHub за 5 минут | Все | ⭐⭐⭐ |
| **READY_TO_PUBLISH.md** | ✅ Финальный чек-лист публикации | Все | ⭐⭐⭐ |
| **README.md** | Основная документация | Разработчики | ⭐⭐⭐ |
| **QUICKSTART.md** | Быстрый старт за 15 минут | Новички | ⭐⭐⭐ |
| **EXAMPLES.md** | Примеры использования API | Разработчики | ⭐⭐⭐ |
| **DEPLOYMENT_CHECKLIST.md** | Чек-лист деплоя (32 пункта) | DevOps | ⭐⭐⭐ |
| **GITHUB_SETUP.md** | Публикация на GitHub | Все | ⭐⭐⭐ |
| **GIT_SETUP.md** | Настройка Git | Разработчики | ⭐⭐ |
| **PROJECT_STATUS.md** | Статус проекта и достижения | Все | ⭐⭐ |
| **PROJECT_STRUCTURE.md** | Структура проекта | Все | ⭐⭐ |
| **COMMANDS.md** | Полезные команды | Разработчики | ⭐⭐ |
| **TESTING.md** | Руководство по тестированию | QA, Разработчики | ⭐⭐ |
| **FAQ.md** | Часто задаваемые вопросы | Все | ⭐⭐ |
| **CHEATSHEET.md** | Шпаргалка | Разработчики | ⭐⭐ |
| **SUMMARY.md** | Резюме проекта | Все | ⭐ |
| **PROJECT_BRIEF.md** | Полное описание с данными | Все | ⭐⭐ |
| **COLLABZA_ANALYSIS.md** | Анализ работы Collabza | Разработчики | ⭐ |
| **PROMPT_FOR_CLAUDE.md** | Промпт для AI разработки | AI разработка | ⭐ |
| **CHANGELOG.md** | История изменений | Все | ⭐ |
| **CONTRIBUTING.md** | Руководство для контрибьюторов | Контрибьюторы | ⭐ |
| **FILES_INDEX.md** | Этот файл | Все | ⭐ |

---

## 🖥️ Backend (8 файлов)

### Главные файлы

| Файл | Описание | Строк | Важность |
|------|----------|-------|----------|
| **server.js** | Express сервер, middleware, роутинг | ~80 | ⭐⭐⭐ |
| **config.js** | Конфигурация приложения | ~35 | ⭐⭐⭐ |
| **package.json** | NPM зависимости и скрипты | ~20 | ⭐⭐⭐ |
| **Dockerfile** | Docker образ для API | ~15 | ⭐⭐ |
| **.env** | Переменные окружения | ~10 | ⭐⭐⭐ |
| **.env.example** | Пример .env файла | ~10 | ⭐⭐ |

### Routes (API endpoints)

| Файл | Endpoints | Строк | Описание |
|------|-----------|-------|----------|
| **routes/widget.js** | 4 endpoints | ~180 | API для виджетов |
| **routes/webhook.js** | 2 endpoints | ~120 | Webhooks от Тільды |

**Endpoints в widget.js:**
- `POST /api/widget/courses` - Список курсов пользователя
- `POST /api/widget/referrals` - Реферальная информация
- `POST /api/widget/profile` - Профиль пользователя
- `POST /api/widget/purchases` - История покупок

**Endpoints в webhook.js:**
- `POST /api/webhook/tilda` - Обработка покупок
- `POST /api/webhook/tilda/signup` - Регистрация пользователя

### Services (Бизнес-логика)

| Файл | Методы | Строк | Описание |
|------|--------|-------|----------|
| **services/nocodb.js** | 10 методов | ~250 | Работа с NocoDB API |

**Методы в nocodb.js:**
- `getUserByEmail(email)` - Получить пользователя по email
- `getUserById(userId)` - Получить пользователя по ID
- `getUserCourses(userId, offset, limit)` - Получить курсы пользователя
- `getUserPurchases(userId, offset, limit)` - Получить покупки
- `getUserReferrals(userId)` - Получить рефералов
- `createPurchase(purchaseData)` - Создать покупку
- `updateUserBonuses(userId, bonusAmount)` - Обновить бонусы
- `updateReferralCount(userId)` - Обновить счётчик рефералов
- `createUser(userData)` - Создать пользователя

### Utils (Утилиты)

| Файл | Функции | Строк | Описание |
|------|---------|-------|----------|
| **utils/helpers.js** | 8 функций | ~150 | Вспомогательные функции |

**Функции в helpers.js:**
- `generateReferralLink(userId, baseUrl)` - Генерация реферальной ссылки
- `formatDate(dateString)` - Форматирование даты
- `generateCourseTableRow(course)` - HTML строка таблицы для курса
- `generateReferralHTML(user, referralsData)` - HTML реферальной информации
- `generateProfileHTML(user)` - HTML профиля пользователя
- `calculatePurchaseBonuses(amount, config)` - Расчёт бонусов
- `isValidEmail(email)` - Валидация email
- `handleAPIError(error, res)` - Обработка ошибок API

---

## 🎨 Frontend (3 файла)

### JavaScript виджеты

| Файл | Описание | Строк | Аналог Collabza |
|------|----------|-------|-----------------|
| **widget/js/widget-table.js** | Таблица курсов с пагинацией | ~150 | e7509dde... |
| **widget/js/widget-cards.js** | Карточки (рефералы, профиль) | ~100 | 5a68810f... |

**Функционал widget-table.js:**
- Чтение профиля из localStorage (Tilda Members)
- Запросы к API сервера
- Рендеринг таблицы курсов
- Пагинация ("Загрузить ещё")
- Многоязычность (8 языков)
- Обработка ошибок

**Функционал widget-cards.js:**
- Чтение профиля из localStorage
- Запросы к API сервера
- Рендеринг карточек
- Клонирование блоков
- Обработка ошибок

### CSS стили

| Файл | Описание | Строк |
|------|----------|-------|
| **widget/css/widget.css** | Стили для виджетов | ~150 |

**Стили включают:**
- Реферальная информация
- Статистика рефералов
- Профиль пользователя
- Мобильная адаптация
- Прелоадер

---

## 🔧 Конфигурация (5 файлов)

| Файл | Описание | Строк | Важность |
|------|----------|-------|----------|
| **docker-compose.yml** | Конфигурация всех сервисов | ~80 | ⭐⭐⭐ |
| **nginx.conf** | Nginx конфигурация | ~70 | ⭐⭐⭐ |
| **.gitignore** | Исключения для Git | ~30 | ⭐⭐ |
| **LICENSE** | MIT License | ~20 | ⭐⭐ |

**Сервисы в docker-compose.yml:**
- PostgreSQL 15 - база данных
- NocoDB latest - UI и API для БД
- API сервер - Node.js приложение
- Nginx - reverse proxy и статика

**Конфигурация nginx.conf:**
- Reverse proxy для API
- Раздача статики виджетов
- CORS настройки
- Gzip сжатие
- SSL поддержка (закомментировано)

---

## 💾 Данные (3 CSV файла)

| Файл | Описание | Записей | Назначение |
|------|----------|---------|------------|
| **Users-Grid view.csv** | Пользователи | ~15 | Импорт в NocoDB |
| **Курсы-Grid view.csv** | Курсы | ~6 | Импорт в NocoDB |
| **Покупки-Grid view.csv** | Покупки | ~19 | Импорт в NocoDB |

**Структура Users:**
- ID, Имя, Email, Тариф, Дата продления
- Кто привёл (реферал), Покупки, Курсы
- Количество рефералов, Бонусы, Created

**Структура Курсы:**
- ID, Название, Ссылка
- Users (кто купил), date

**Структура Покупки:**
- ID, Email, order_id, Оплата
- Покупатель, ID курса, Бонусы начислить
- Created

---

## 📜 Оригинальные скрипты Collabza (2 файла)

| Файл | Описание | Назначение |
|------|----------|------------|
| **e7509dde-3bfa-44dc-b455-2465e75e6614.js** | Оригинальный скрипт Collabza для таблицы | Для анализа |
| **5a68810f-ae08-4415-b05f-d13502f8d706.js** | Оригинальный скрипт Collabza для карточек | Для анализа |

---

## 📊 Статистика проекта

### Общая статистика

| Категория | Файлов | Строк кода | Размер |
|-----------|--------|------------|--------|
| Документация | 15 | ~4500 | ~180 KB |
| Backend | 8 | ~1200 | ~45 KB |
| Frontend | 3 | ~400 | ~15 KB |
| Конфигурация | 5 | ~200 | ~8 KB |
| Данные | 3 | ~50 | ~150 KB |
| Оригинальные скрипты | 2 | ~200 | ~8 KB |
| **Всего** | **36** | **~6550** | **~406 KB** |

### Распределение по типам

```
Документация:  42% (15 файлов)
Backend:       22% (8 файлов)
Конфигурация:  14% (5 файлов)
Данные:        8% (3 файлов)
Frontend:      8% (3 файлов)
Оригинальные:  6% (2 файла)
```

### Языки программирования

```
JavaScript:  ~1800 строк (Backend + Frontend)
Markdown:    ~4500 строк (Документация)
YAML:        ~80 строк (Docker Compose)
Nginx conf:  ~70 строк
CSS:         ~150 строк
JSON:        ~50 строк (package.json, .env)
```

---

## 🎯 Приоритет чтения

### Для новичков (начните с этого):
1. ⭐⭐⭐ **START_HERE.md** - точка входа
2. ⭐⭐⭐ **QUICKSTART.md** - быстрый старт
3. ⭐⭐ **FAQ.md** - ответы на вопросы
4. ⭐⭐ **EXAMPLES.md** - примеры использования

### Для разработчиков:
1. ⭐⭐⭐ **README.md** - полная документация
2. ⭐⭐⭐ **PROJECT_STRUCTURE.md** - структура проекта
3. ⭐⭐ **TESTING.md** - тестирование
4. ⭐⭐ **COMMANDS.md** - полезные команды
5. ⭐ **CONTRIBUTING.md** - как внести вклад

### Для DevOps:
1. ⭐⭐⭐ **DEPLOYMENT_CHECKLIST.md** - чек-лист деплоя
2. ⭐⭐ **docker-compose.yml** - конфигурация
3. ⭐⭐ **nginx.conf** - настройка Nginx
4. ⭐⭐ **COMMANDS.md** - команды для управления

### Для понимания проекта:
1. ⭐⭐ **PROJECT_BRIEF.md** - полное описание
2. ⭐ **COLLABZA_ANALYSIS.md** - анализ Collabza
3. ⭐ **SUMMARY.md** - резюме проекта
4. ⭐ **CHANGELOG.md** - история изменений

---

## 🔍 Поиск по файлам

### Нужно найти информацию о:

**Установке и запуске:**
- QUICKSTART.md
- README.md
- docker-compose.yml

**API endpoints:**
- backend/routes/widget.js
- backend/routes/webhook.js
- EXAMPLES.md

**Работе с NocoDB:**
- backend/services/nocodb.js
- PROJECT_BRIEF.md (раздел "Структура данных")

**Виджетах для Тільды:**
- widget/js/widget-table.js
- widget/js/widget-cards.js
- EXAMPLES.md (раздел "Интеграция с Тільдой")

**Реферальной системе:**
- backend/utils/helpers.js (функция generateReferralLink)
- backend/routes/webhook.js (обработка utm_source)
- PROJECT_BRIEF.md (раздел "Реферальная система")

**Начислении бонусов:**
- backend/utils/helpers.js (функция calculatePurchaseBonuses)
- backend/services/nocodb.js (функция updateUserBonuses)
- backend/.env (PURCHASE_BONUS, REFERRAL_BONUS)

**Тестировании:**
- TESTING.md
- EXAMPLES.md

**Деплое:**
- DEPLOYMENT_CHECKLIST.md
- docker-compose.yml
- nginx.conf

**Проблемах и ошибках:**
- FAQ.md
- TESTING.md (раздел "Отладка")

---

## 📝 Как использовать этот индекс

1. **Найдите нужный файл** в таблицах выше
2. **Проверьте приоритет** (⭐⭐⭐ - важно, ⭐ - опционально)
3. **Откройте файл** и читайте
4. **Используйте поиск** (Ctrl+F) для быстрого поиска

---

## 🔄 Обновление индекса

При добавлении новых файлов обновите:
1. Этот файл (FILES_INDEX.md)
2. PROJECT_STRUCTURE.md
3. README.md (если нужно)

---

**Последнее обновление:** 20 марта 2026  
**Версия:** 1.0.0  
**Всего файлов:** 36
