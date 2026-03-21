# 📝 Changelog

Все значимые изменения в проекте E-Budget Backend будут документированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

---

## [1.0.0] - 2026-03-20

### 🎉 Первый релиз

Полная замена Collabza + Airtable + Make на self-hosted решение.

### ✨ Добавлено

#### Backend API
- Express сервер с REST API
- Интеграция с NocoDB
- 6 API endpoints для виджетов:
  - `POST /api/widget/courses` - список курсов
  - `POST /api/widget/referrals` - реферальная информация
  - `POST /api/widget/profile` - профиль пользователя
  - `POST /api/widget/purchases` - история покупок
  - `POST /api/webhook/tilda` - обработка покупок
  - `POST /api/webhook/tilda/signup` - регистрация
- Реферальная система с начислением бонусов
- Обработка webhooks от Тільды
- CORS поддержка
- Логирование запросов
- Обработка ошибок

#### Frontend виджеты
- Виджет таблицы курсов с пагинацией
- Виджет реферальной информации
- Стили для виджетов
- Поддержка Tilda Members
- Многоязычность (8 языков)
- Мобильная адаптация

#### Infrastructure
- Docker Compose конфигурация
- PostgreSQL 15
- NocoDB latest
- Nginx reverse proxy
- Health checks для всех сервисов
- Автоматический restart

#### Документация
- README.md - полная документация
- QUICKSTART.md - быстрый старт (15 минут)
- EXAMPLES.md - примеры использования
- DEPLOYMENT_CHECKLIST.md - чек-лист деплоя (32 пункта)
- PROJECT_STRUCTURE.md - структура проекта
- COMMANDS.md - полезные команды
- TESTING.md - руководство по тестированию
- FAQ.md - часто задаваемые вопросы
- START_HERE.md - точка входа
- SUMMARY.md - резюме проекта
- PROJECT_BRIEF.md - полное описание
- COLLABZA_ANALYSIS.md - анализ Collabza
- PROMPT_FOR_CLAUDE.md - промпт для AI

#### Конфигурация
- .env.example с примерами
- .gitignore
- Dockerfile для API
- nginx.conf с оптимизацией

### 🔧 Технологии

- Node.js 18+
- Express 4.18
- PostgreSQL 15
- NocoDB latest
- Docker & Docker Compose
- Nginx Alpine

### 📊 Статистика

- 25 файлов
- ~5350 строк кода
- 13 файлов документации
- 8 backend файлов
- 3 frontend файла

---

## [Unreleased]

### 🚀 Планируется

#### Функционал
- [ ] Email уведомления (nodemailer)
- [ ] Telegram уведомления (Telegram Bot API)
- [ ] Админ-панель (React Admin)
- [ ] Аналитика (Grafana + Prometheus)
- [ ] Экспорт данных (CSV, Excel)
- [ ] Импорт пользователей (bulk import)
- [ ] Система промокодов
- [ ] Подписки и рекуррентные платежи

#### Улучшения
- [ ] Кэширование (Redis)
- [ ] Rate limiting
- [ ] JWT авторизация
- [ ] WebSocket для real-time обновлений
- [ ] GraphQL API
- [ ] TypeScript миграция
- [ ] Unit тесты (Jest)
- [ ] E2E тесты (Playwright)

#### Документация
- [ ] API документация (Swagger/OpenAPI)
- [ ] Видео туториалы
- [ ] Примеры интеграций
- [ ] Best practices

---

## Типы изменений

- `Added` - новый функционал
- `Changed` - изменения в существующем функционале
- `Deprecated` - функционал, который скоро будет удалён
- `Removed` - удалённый функционал
- `Fixed` - исправления багов
- `Security` - исправления уязвимостей

---

## Как внести изменения

1. Создать ветку: `git checkout -b feature/название`
2. Внести изменения
3. Обновить CHANGELOG.md
4. Создать commit: `git commit -m "feat: описание"`
5. Создать Pull Request

### Формат commit сообщений

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - новый функционал
- `fix` - исправление бага
- `docs` - изменения в документации
- `style` - форматирование кода
- `refactor` - рефакторинг
- `test` - добавление тестов
- `chore` - обновление зависимостей

**Примеры:**
```
feat: add email notifications
fix: resolve CORS issue
docs: update README with new examples
```

---

## Версионирование

Проект использует [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x) - несовместимые изменения API
- **MINOR** (x.1.x) - новый функционал (обратно совместимый)
- **PATCH** (x.x.1) - исправления багов

---

## История версий

### [1.0.0] - 2026-03-20
- Первый стабильный релиз
- Полная замена Collabza + Airtable + Make
- Готово к продакшн использованию

---

## Roadmap

### Q2 2026
- [ ] Email уведомления
- [ ] Telegram бот
- [ ] Админ-панель
- [ ] Кэширование (Redis)

### Q3 2026
- [ ] Аналитика и отчёты
- [ ] Система промокодов
- [ ] Подписки
- [ ] Mobile app (React Native)

### Q4 2026
- [ ] GraphQL API
- [ ] WebSocket real-time
- [ ] Микросервисная архитектура
- [ ] Kubernetes деплой

---

## Поддержка версий

| Версия | Статус | Релиз | Поддержка до |
|--------|--------|-------|--------------|
| 1.0.x | Stable | 2026-03-20 | 2027-03-20 |

---

## Благодарности

Спасибо всем, кто внёс вклад в проект!

### Контрибьюторы
- [@your-username] - создатель проекта

### Используемые проекты
- [NocoDB](https://github.com/nocodb/nocodb) - open-source Airtable alternative
- [Express](https://expressjs.com/) - web framework
- [PostgreSQL](https://www.postgresql.org/) - database
- [Docker](https://www.docker.com/) - containerization

---

**Хотите внести вклад?** Читайте [CONTRIBUTING.md](CONTRIBUTING.md)

**Нашли баг?** Создайте [issue](https://github.com/your-repo/e-budget-backend/issues)

**Есть вопросы?** Читайте [FAQ.md](FAQ.md)
