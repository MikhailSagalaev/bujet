# АНАЛИЗ СКРИПТОВ COLLABZA И ПЛАН ЗАМЕНЫ

## 1. КАК РАБОТАЕТ COLLABZA (ТЕКУЩАЯ РЕАЛИЗАЦИЯ)

### 1.1 Архитектура Collabza

```
┌─────────────────────────────────────────────────────────────────┐
│                    ТЕКУЩАЯ РАБОТА COLLABZA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Тильда (HTML-блок)                                             │
│       │                                                         │
│       ├─► Collabza JS скрипт (встроен в блок)                  │
│       │        │                                                │
│       │        ├─► Читает профиль из localStorage               │
│       │        │   (tilda_members_profile{project_id})          │
│       │        │                                                │
│       │        ├─► Отправляет POST запрос на:                  │
│       │        │   https://functions.yandexcloud.net/...        │
│       │        │                                                │
│       │        │   Payload:                                     │
│       │        │   - tool_id (ID виджета)                       │
│       │        │   - profile (данные пользователя)              │
│       │        │   - filters (фильтры из URL)                   │
│       │        │                                                │
│       │        └─► Получает данные из Airtable                 │
│       │                                                         │
│       └─► Рендерит данные в блок Тильды                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Два типа виджетов

#### Виджет 1: Таблица с пагинацией (e7509dde...)
**Назначение:** Отображение списка курсов в виде таблицы

**Ключевые особенности:**
- Использует блок Тильды `#rec543510144` (таблица T431)
- Поддерживает пагинацию ("Загрузить ещё")
- Фильтрация через URL параметры `?filters543510144=...`
- Многоязычность (EN, RU, FR, DE, ES, PT, UK, JA, ZH)

**Алгоритм работы:**
```javascript
1. Читает профиль из localStorage
2. Отправляет POST на Yandex Cloud Function:
   {
     tool_id: "e7509dde-3bfa-44dc-b455-2465e75e6614",
     profile: { login: "user@email.com", ... },
     filters: "...",
     offset: null  // для пагинации
   }
3. Получает ответ:
   {
     records: [
       { table_content: "HTML строка таблицы" },
       ...
     ],
     offset: 10  // если есть ещё данные
   }
4. Вставляет HTML в .t431__data-part2
5. Вызывает t431_init() для инициализации таблицы Тильды
```

#### Виджет 2: Карточки/HTML блоки (5a68810f...)
**Назначение:** Отображение данных в виде карточек/блоков

**Ключевые особенности:**
- Использует блок Тильды `#rec556083146` (блок T123)
- Клонирует блок для каждой записи
- Вставляет HTML в `.t123 > div > div`

**Алгоритм работы:**
```javascript
1. Читает профиль из localStorage
2. Отправляет POST на Yandex Cloud Function:
   {
     tool_id: "5a68810f-ae08-4415-b05f-d13502f8d706",
     profile: { login: "user@email.com", ... },
     filters: "..."
   }
3. Получает ответ:
   {
     records: [
       { html: "<div>Контент карточки</div>" },
       ...
     ]
   }
4. Для каждой записи:
   - Клонирует блок-шаблон
   - Вставляет HTML
   - Добавляет в контейнер
```

### 1.3 Формат профиля пользователя

```javascript
// Хранится в localStorage
{
  "login": "user@email.com",  // Email пользователя
  "name": "Имя",
  "id": "recXXXXXXXXXXXXX",   // ID в Airtable
  // groups и courses удаляются перед отправкой
}
```

---

## 2. ЧТО НУЖНО ЗАМЕНИТЬ

### 2.1 Компоненты для замены

| Компонент | Текущее | Новое |
|-----------|---------|-------|
| Backend API | Yandex Cloud Function | Ваш Node.js/Python сервер |
| База данных | Airtable | NocoDB + PostgreSQL |
| JS виджет | Collabza скрипт | Кастомный JS виджет |
| Авторизация | Tilda Members | Tilda Members (остаётся) |

### 2.2 Что остаётся без изменений

✅ Тильда и её блоки (T431, T123)
✅ Система авторизации Tilda Members
✅ localStorage для хранения профиля
✅ Структура HTML блоков

---

## 3. АРХИТЕКТУРА НОВОГО РЕШЕНИЯ

```
┌─────────────────────────────────────────────────────────────────┐
│                    НОВАЯ АРХИТЕКТУРА                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Тильда (HTML-блок)                                             │
│       │                                                         │
│       ├─► Ваш JS виджет (аналог Collabza)                      │
│       │        │                                                │
│       │        ├─► Читает профиль из localStorage               │
│       │        │   (tilda_members_profile{project_id})          │
│       │        │                                                │
│       │        ├─► Отправляет POST/GET на:                     │
│       │        │   https://your-server.ru/api/widget            │
│       │        │                                                │
│       │        │   Payload:                                     │
│       │        │   - widget_type (table/cards)                  │
│       │        │   - user_email                                 │
│       │        │   - filters                                    │
│       │        │   - offset (для пагинации)                     │
│       │        │                                                │
│       │        └─► Получает данные из NocoDB                   │
│       │                                                         │
│       └─► Рендерит данные в блок Тильды                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ВАШ СЕРВЕР (Node.js/Python)                 │  │
│  │                                                          │  │
│  │  API Endpoints:                                          │  │
│  │  ├─ POST /api/widget/courses    (список курсов)         │  │
│  │  ├─ POST /api/widget/purchases  (история покупок)       │  │
│  │  ├─ POST /api/widget/referrals  (реферальная система)   │  │
│  │  └─ POST /api/webhook/tilda     (webhooks от Тильды)    │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │              NocoDB API                            │ │  │
│  │  │  GET /api/v1/db/data/v1/{project}/Users            │ │  │
│  │  │  GET /api/v1/db/data/v1/{project}/Курсы            │ │  │
│  │  │  GET /api/v1/db/data/v1/{project}/Покупки          │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │           PostgreSQL (через NocoDB)                │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. ДЕТАЛЬНЫЙ ПЛАН РАЗРАБОТКИ

### Этап 1: Настройка NocoDB (1 день)

**Задачи:**
1. Развернуть NocoDB через Docker Compose
2. Создать проект "E-Budget"
3. Импортировать 3 таблицы из CSV:
   - Users (Пользователи)
   - Курсы
   - Покупки
4. Настроить связи между таблицами
5. Получить API токен

**Результат:** NocoDB работает, данные импортированы

---

### Этап 2: Backend API (3-4 дня)

**Стек:** Node.js + Express (или Python + FastAPI)

**Структура проекта:**
```
backend/
├── server.js              # Главный файл
├── config.js              # Конфигурация (NocoDB URL, токен)
├── routes/
│   ├── widget.js          # Endpoints для виджетов
│   └── webhook.js         # Webhooks от Тильды
├── services/
│   ├── nocodb.js          # Работа с NocoDB API
│   ├── courses.js         # Логика курсов
│   ├── purchases.js       # Логика покупок
│   └── referrals.js       # Реферальная система
└── utils/
    └── helpers.js         # Утилиты
```

**API Endpoints:**

#### 1. GET /api/widget/courses
**Назначение:** Получить список курсов пользователя

**Request:**
```json
{
  "user_email": "user@email.com",
  "widget_type": "table",
  "offset": 0,
  "limit": 10
}
```

**Response:**
```json
{
  "records": [
    {
      "table_content": "<tr><td>Название курса</td><td><a href='...'>Перейти</a></td></tr>"
    }
  ],
  "offset": 10,
  "total": 25
}
```

#### 2. GET /api/widget/referrals
**Назначение:** Реферальная информация

**Request:**
```json
{
  "user_email": "user@email.com"
}
```

**Response:**
```json
{
  "referral_link": "https://e-budget.ru/members/signup?utm_source=recXXX...",
  "referrals_count": 5,
  "paid_referrals": 2,
  "bonuses": 1150
}
```

#### 3. POST /api/webhook/tilda
**Назначение:** Обработка покупок от Тильды

**Request (от Тильды):**
```json
{
  "Email": "user@email.com",
  "Name": "Имя",
  "order_id": "1234567890",
  "payment": "Да",
  "course_id": "recc4DgQg3Q7dcuL4",
  "amount": 420
}
```

**Действия:**
1. Найти пользователя по Email
2. Создать запись в таблице "Покупки"
3. Начислить бонусы
4. Если есть реферал — начислить бонусы рефералу
5. Отправить уведомление (опционально)

---

### Этап 3: JS Виджет (3-4 дня)

**Структура:**
```
widget/
├── index.html             # Для тестирования
├── css/
│   └── widget.css         # Стили (минимальные)
└── js/
    ├── widget-table.js    # Виджет таблицы (аналог e7509dde)
    ├── widget-cards.js    # Виджет карточек (аналог 5a68810f)
    ├── api.js             # Работа с вашим API
    └── utils.js           # Утилиты
```

#### widget-table.js (Таблица курсов)

```javascript
(function() {
  const API_URL = "https://your-server.ru/api";
  const BLOCK_ID = "#rec543510144";
  
  $(document).ready(function() {
    const block_id = BLOCK_ID.substring(4);
    const block_template = $(BLOCK_ID).removeClass("r_hidden");
    
    // Получаем профиль из localStorage (как у Collabza)
    const project_id = $("#allrecords").attr("data-tilda-project-id");
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) || "{}"
    );
    
    // Функция загрузки данных
    function loadCourses(offset = 0) {
      $.ajax({
        url: `${API_URL}/widget/courses`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_email: profile.login,
          widget_type: "table",
          offset: offset,
          limit: 10
        }),
        success: function(data) {
          // Вставляем HTML строки таблицы
          let html = "";
          data.records.forEach(record => {
            html += record.table_content;
          });
          
          block_template.find(".t431__data-part2").html(html);
          t431_init(block_id);
          
          // Кнопка "Загрузить ещё"
          if (data.offset) {
            showLoadMoreButton(data.offset);
          }
        },
        error: function(xhr) {
          console.error("Ошибка загрузки курсов:", xhr);
        }
      });
    }
    
    loadCourses();
  });
})();
```

#### widget-cards.js (Карточки)

```javascript
(function() {
  const API_URL = "https://your-server.ru/api";
  const BLOCK_ID = "#rec556083146";
  
  $(document).ready(function() {
    const block_id = BLOCK_ID.substring(4);
    const block = $(BLOCK_ID).removeClass("r_hidden");
    const container = $(`#rec${block_id}`);
    
    // Получаем профиль
    const project_id = $("#allrecords").attr("data-tilda-project-id");
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) || "{}"
    );
    
    // Загружаем данные
    $.ajax({
      url: `${API_URL}/widget/referrals`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        user_email: profile.login
      }),
      success: function(data) {
        // Клонируем блок для каждой записи
        data.records.forEach((record, index) => {
          const item = block.clone(true).attr("id", `rec${block_id}_${index}`);
          item.find(".t123 > div > div").html(record.html);
          item.appendTo(container);
        });
        
        $(window).trigger("resize");
      },
      error: function(xhr) {
        console.error("Ошибка загрузки данных:", xhr);
      }
    });
  });
})();
```

---

### Этап 4: Интеграция с Тильдой (1 день)

**Как встроить виджет в Тильду:**

1. Создать HTML-блок на странице
2. Вставить код:

```html
<!-- Подключаем jQuery (если ещё не подключен) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Подключаем ваш виджет -->
<script src="https://your-server.ru/widget/widget-table.js"></script>

<!-- Блок для отображения (используем существующий блок Тильды) -->
<div id="rec543510144" class="r_hidden">
  <!-- Структура блока T431 (таблица) -->
</div>
```

**Важно:** Используйте те же ID блоков, что и в Collabza, чтобы не переделывать структуру!

---

### Этап 5: Реферальная система (2 дня)

**Логика работы:**

1. **Генерация реферальной ссылки:**
```javascript
// Backend: /api/user/referral-link
function generateReferralLink(userId) {
  return `https://e-budget.ru/members/signup?utm_source=${userId}&utm_medium=referral&utm_campaign=friends`;
}
```

2. **Регистрация по реферальной ссылке:**
```javascript
// При регистрации на Тильде
// Webhook от Тильды → ваш сервер
{
  "Email": "newuser@email.com",
  "Name": "Новый пользователь",
  "utm_source": "recXXXXXXXXXXXXX"  // ID реферала
}

// Создаём пользователя и связываем с рефералом
await createUser({
  email: "newuser@email.com",
  name: "Новый пользователь",
  referred_by: "recXXXXXXXXXXXXX"
});
```

3. **Начисление бонусов:**
```javascript
// При покупке реферала
async function handlePurchase(purchase) {
  const user = await getUser(purchase.email);
  
  // Начисляем бонусы покупателю
  await addBonuses(user.id, 300);
  
  // Если есть реферал — начисляем ему тоже
  if (user.referred_by) {
    await addBonuses(user.referred_by, 100);
  }
}
```

---

### Этап 6: Webhooks от Тильды (1 день)

**Настройка в Тильде:**
1. Зайти в настройки формы
2. Добавить webhook: `https://your-server.ru/api/webhook/tilda`
3. Выбрать события: "Успешная оплата"

**Обработка на сервере:**

```javascript
// routes/webhook.js
app.post('/api/webhook/tilda', async (req, res) => {
  try {
    const { Email, order_id, payment, course_id, amount } = req.body;
    
    // Проверяем оплату
    if (payment !== "Да") {
      return res.status(200).json({ status: "skipped" });
    }
    
    // Находим пользователя
    const user = await nocodb.getUserByEmail(Email);
    
    // Создаём покупку
    await nocodb.createPurchase({
      Email: Email,
      order_id: order_id,
      Покупатель: user.Id,
      "ID курса": course_id,
      Оплата: "Да",
      "Бонусы начислить": calculateBonuses(amount)
    });
    
    // Начисляем бонусы
    await addBonuses(user.Id, calculateBonuses(amount));
    
    // Если есть реферал
    if (user["Кто привёл"]) {
      await addBonuses(user["Кто привёл"], 100);
    }
    
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 5. МИГРАЦИЯ ДАННЫХ

### 5.1 Импорт в NocoDB

**Способ 1: Через UI (рекомендуется)**
1. Открыть NocoDB
2. Создать новый проект "E-Budget"
3. Импортировать CSV файлы:
   - Users-Grid view.csv → таблица "Users"
   - Курсы-Grid view.csv → таблица "Курсы"
   - Покупки-Grid view.csv → таблица "Покупки"
4. Настроить связи (Links):
   - Users.Покупки → Покупки.Покупатель
   - Users.Курсы_link → Курсы.Users
   - Покупки.ID курса → Курсы.ID

**Способ 2: Через API (автоматизация)**
```javascript
// Скрипт миграции
const csv = require('csv-parser');
const fs = require('fs');

async function importUsers() {
  const users = [];
  fs.createReadStream('Users-Grid view.csv')
    .pipe(csv())
    .on('data', (row) => users.push(row))
    .on('end', async () => {
      for (const user of users) {
        await nocodb.createRecord('Users', {
          ID: user.ID,
          Имя: user.Имя,
          Email: user.Email,
          Тариф: user.Тариф,
          // ... остальные поля
        });
      }
    });
}
```

---

## 6. ТЕСТИРОВАНИЕ

### 6.1 Чек-лист тестирования

- [ ] NocoDB доступен и работает
- [ ] Данные импортированы корректно
- [ ] Связи между таблицами настроены
- [ ] API сервер отвечает на запросы
- [ ] Виджет таблицы отображает курсы
- [ ] Виджет карточек отображает данные
- [ ] Пагинация работает
- [ ] Реферальная ссылка генерируется
- [ ] Webhook от Тильды обрабатывается
- [ ] Бонусы начисляются корректно
- [ ] Мобильная версия работает

---

## 7. ДЕПЛОЙ

### 7.1 Docker Compose (всё в одном)

```yaml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: nocouser
      POSTGRES_PASSWORD: nocopass
      POSTGRES_DB: nocodb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # NocoDB
  nocodb:
    image: nocodb/nocodb:latest
    ports:
      - "8080:8080"
    environment:
      NC_DB: "postgresql://nocouser:nocopass@postgres:5432/nocodb"
      NC_PUBLIC_URL: "https://nocodb.your-domain.ru"
    depends_on:
      - postgres
    volumes:
      - nocodb_data:/usr/app/data
    restart: unless-stopped

  # Ваш API сервер
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NOCODB_URL: "http://nocodb:8080"
      NOCODB_TOKEN: "your-api-token"
    depends_on:
      - nocodb
    restart: unless-stopped

  # Nginx (для статики виджетов)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./widget:/usr/share/nginx/html/widget
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: unless-stopped

volumes:
  postgres_data:
  nocodb_data:
```

### 7.2 Команды деплоя

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-repo/e-budget-backend.git
cd e-budget-backend

# 2. Настроить .env
cp .env.example .env
nano .env

# 3. Запустить
docker-compose up -d

# 4. Проверить логи
docker-compose logs -f

# 5. Импортировать данные в NocoDB
# Открыть http://your-server:8080
# Импортировать CSV файлы
```

---

## 8. ОЦЕНКА СРОКОВ И СЛОЖНОСТИ

| Этап | Сложность | Время | Описание |
|------|-----------|-------|----------|
| 1. NocoDB | ⭐ Легко | 1 день | Развёртывание и импорт |
| 2. Backend API | ⭐⭐⭐ Средне | 3-4 дня | Node.js + NocoDB API |
| 3. JS Виджет | ⭐⭐⭐ Средне | 3-4 дня | Аналог Collabza |
| 4. Интеграция | ⭐⭐ Легко | 1 день | Встраивание в Тильду |
| 5. Реферальная система | ⭐⭐ Средне | 2 дня | Логика бонусов |
| 6. Webhooks | ⭐⭐ Легко | 1 день | Обработка от Тильды |
| 7. Тестирование | ⭐⭐ Средне | 2 дня | Полное тестирование |
| 8. Деплой | ⭐ Легко | 1 день | Docker Compose |

**Итого:** 14-17 дней разработки

---

## 9. СЛЕДУЮЩИЕ ШАГИ

1. ✅ Развернуть NocoDB на сервере
2. ✅ Импортировать данные из CSV
3. ✅ Создать базовый API сервер
4. ✅ Разработать первый виджет (таблица курсов)
5. ✅ Протестировать на тестовой странице Тильды
6. ✅ Добавить остальные виджеты
7. ✅ Внедрить реферальную систему
8. ✅ Настроить webhooks
9. ✅ Полное тестирование
10. ✅ Деплой на продакшн

---

**Готовы начать? Какой этап хотите разобрать детальнее?**
