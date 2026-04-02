# E-Budget Backend

Backend API для e-budget.ru с интеграцией NocoDB и Resend.

## Возможности

- Widget API для отображения данных пользователей
- Webhook для обработки событий Tilda
- Quiz API с отправкой email через Resend
- Интеграция с NocoDB

## Быстрый старт

```bash
cd backend
npm install
cp .env.example .env
# Отредактируйте .env
npm start
```

## Endpoints

### Widget API
- `POST /api/widget/courses` - список курсов пользователя
- `POST /api/widget/referrals` - рефералы пользователя
- `POST /api/widget/profile` - профиль пользователя
- `POST /api/widget/purchases` - покупки пользователя

### Webhook API
- `POST /api/webhook/tilda` - обработка событий Tilda
- `POST /api/webhook/tilda/signup` - регистрация через Tilda

### Quiz API
- `POST /api/quiz/submit` - отправка результатов квиза

## Настройка

### Переменные окружения (.env)

```env
# NocoDB
NOCODB_URL=http://localhost:8080
NOCODB_TOKEN=your-token
NOCODB_PROJECT_ID=your-project-id

# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://e-budget.ru,https://tilda.cc

# Resend Email
RESEND_API_KEY=your-resend-api-key
```

## Деплой

### PM2
```bash
pm2 start backend/server.js --name e-budget-backend
pm2 save
pm2 startup
```

### Docker
```bash
docker-compose up -d
```

## Структура

```
backend/
├── routes/
│   ├── widget.js    # Widget API
│   ├── webhook.js   # Tilda webhooks
│   └── quiz.js      # Quiz + Resend
├── services/
│   └── nocodb.js    # NocoDB client
├── utils/
│   └── helpers.js   # Утилиты
├── server.js        # Express app
└── config.js        # Конфигурация
```

## Документация

- `CHANGELOG.md` - история изменений
- `CONTRIBUTING.md` - как контрибьютить
- `DEPLOYMENT_CHECKLIST.md` - чеклист деплоя
- `PROJECT_BRIEF.md` - описание проекта
- `PROJECT_STRUCTURE.md` - структура проекта

## License

MIT
