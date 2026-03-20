# ЗАДАЧА: Разработка замены Collabza + Airtable на NocoDB + кастомный виджет

## КОНТЕКСТ

У меня есть сайт на Тильде с личными кабинетами. Сейчас используется:
- **Collabza** — JS-виджет для отображения данных из Airtable на Тильде
- **Airtable** — облачная база данных
- **Make** — обработка webhooks от Тильды

Иностранные сервисы уходят из РФ. Нужно заменить на self-hosted решение:
- **NocoDB** вместо Airtable (уже выбран)
- **Кастомный JS виджет** вместо Collabza
- **Свой API сервер** вместо Make

---

## КАК РАБОТАЕТ COLLABZA (ТЕКУЩАЯ РЕАЛИЗАЦИЯ)

### Архитектура
```
Тильда → Collabza JS → Yandex Cloud Function → Airtable
         ↓
    Рендеринг в блок Тильды
```

### Два типа виджетов

**1. Таблица с пагинацией (для списка курсов)**
```javascript
// Скрипт читает профиль из localStorage
const profile = JSON.parse(
  localStorage.getItem(`tilda_members_profile${project_id}`) || "{}"
);

// Отправляет POST на Cloud Function
$.post(TOOLS_RUNNER_URL, {
  tool_id: "e7509dde-3bfa-44dc-b455-2465e75e6614",
  profile: profile,
  filters: filters,
  offset: 0
}, function(data) {
  // Получает HTML строки таблицы
  data.records.forEach(record => {
    html += record.table_content;  // "<tr><td>...</td></tr>"
  });
  
  // Вставляет в блок T431 (таблица Тильды)
  block.find(".t431__data-part2").html(html);
  t431_init(block_id);  // Инициализирует таблицу Тильды
});
```

**2. Карточки/блоки (для реферальной информации)**
```javascript
// Отправляет POST на Cloud Function
$.post(TOOLS_RUNNER_URL, {
  tool_id: "5a68810f-ae08-4415-b05f-d13502f8d706",
  profile: profile
}, function(data) {
  // Получает HTML для каждой карточки
  data.records.forEach((record, index) => {
    const item = block.clone();
    item.find(".t123 > div > div").html(record.html);
    item.appendTo(container);
  });
});
```

---

## СТРУКТУРА ДАННЫХ (3 ТАБЛИЦЫ)

### Таблица 1: Users (Пользователи)
```
ID (recXXXXXXXXXXXXX)
Имя (текст)
Email (email)
Тариф (🥈Базовый / 🥇Про)
Дата продления (дата)
Кто привёл (связь с Users) - реферал
Покупки (связь с Покупки)
Курсы_link (связь с Курсы)
Количество рефералов (число)
Оплатили подписку (число)
Бонусы (число)
Created (дата)
```

### Таблица 2: Курсы
```
ID (recXXXXXXXXXXXXX)
Название (текст)
Ссылка (URL)
Users (связь с Users) - кто купил
date (дата)
```

### Таблица 3: Покупки
```
ID (recXXXXXXXXXXXXX)
Email (email)
order_id (число) - ID заказа из Тильды
Оплата (Да/Нет)
Покупатель (связь с Users)
Бонусы начислить (число)
ID курса (связь с Курсы)
Created (дата)
```

### Связи
```
Users ←→ Покупки (через "Покупатель")
Users ←→ Курсы (через "Users")
Users ←→ Users (реферальная связь через "Кто привёл")
Покупки ←→ Курсы (через "ID курса")
```

---

## ЧТО НУЖНО РАЗРАБОТАТЬ

### 1. Backend API (Node.js + Express)

**Структура:**
```
backend/
├── server.js
├── config.js
├── routes/
│   ├── widget.js      # Endpoints для виджетов
│   └── webhook.js     # Webhooks от Тильды
├── services/
│   ├── nocodb.js      # Работа с NocoDB API
│   ├── courses.js     # Логика курсов
│   ├── purchases.js   # Логика покупок
│   └── referrals.js   # Реферальная система
└── utils/
    └── helpers.js
```

**API Endpoints:**

#### POST /api/widget/courses
Получить список курсов пользователя для таблицы

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
      "table_content": "<tr><td>Название курса</td><td><a href='https://...'>Перейти</a></td></tr>"
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
      "html": "<div>Реферальная ссылка: https://...</div><div>Рефералов: 5</div><div>Бонусы: 1150</div>"
    }
  ]
}
```

#### POST /api/webhook/tilda
Обработка покупок от Тильды

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
1. Найти пользователя по Email в NocoDB
2. Создать запись в таблице "Покупки"
3. Начислить бонусы пользователю
4. Если есть реферал (поле "Кто привёл") — начислить бонусы рефералу
5. Вернуть success

---

### 2. JS Виджет (аналог Collabza)

**Структура:**
```
widget/
├── js/
│   ├── widget-table.js    # Виджет таблицы курсов
│   ├── widget-cards.js    # Виджет карточек
│   └── api.js             # Работа с API
└── css/
    └── widget.css
```

**widget-table.js** — должен работать ТОЧНО ТАК ЖЕ как Collabza:
```javascript
(function() {
  const API_URL = "https://your-server.ru/api";
  const BLOCK_ID = "#rec543510144";  // ID блока Тільды
  
  $(document).ready(function() {
    // 1. Читаем профиль из localStorage (как Collabza)
    const project_id = $("#allrecords").attr("data-tilda-project-id");
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) || "{}"
    );
    
    // 2. Загружаем данные с нашего API
    $.ajax({
      url: `${API_URL}/widget/courses`,
      method: "POST",
      data: JSON.stringify({
        user_email: profile.login,
        offset: 0
      }),
      success: function(data) {
        // 3. Вставляем HTML в блок (как Collabza)
        let html = "";
        data.records.forEach(record => {
          html += record.table_content;
        });
        
        $(BLOCK_ID).find(".t431__data-part2").html(html);
        t431_init("543510144");  // Инициализируем таблицу Тільды
        
        // 4. Кнопка "Загрузить ещё" (если есть offset)
        if (data.offset) {
          // Показать кнопку пагинации
        }
      }
    });
  });
})();
```

**widget-cards.js** — для реферальной информации:
```javascript
(function() {
  const API_URL = "https://your-server.ru/api";
  const BLOCK_ID = "#rec556083146";
  
  $(document).ready(function() {
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) || "{}"
    );
    
    $.ajax({
      url: `${API_URL}/widget/referrals`,
      method: "POST",
      data: JSON.stringify({
        user_email: profile.login
      }),
      success: function(data) {
        // Клонируем блок для каждой записи (как Collabza)
        data.records.forEach((record, index) => {
          const item = $(BLOCK_ID).clone();
          item.find(".t123 > div > div").html(record.html);
          item.appendTo(container);
        });
      }
    });
  });
})();
```

---

### 3. Работа с NocoDB API

**Примеры запросов:**

```javascript
// Получить пользователя по Email
GET http://nocodb:8080/api/v1/db/data/v1/{project}/Users?where=(Email,eq,user@email.com)
Headers: xc-token: YOUR_TOKEN

// Получить курсы пользователя
GET http://nocodb:8080/api/v1/db/data/v1/{project}/Курсы?where=(Users,like,recXXXXXXXXXXXXX)

// Создать покупку
POST http://nocodb:8080/api/v1/db/data/v1/{project}/Покупки
Body: {
  "Email": "user@email.com",
  "order_id": "1234567890",
  "Оплата": "Да",
  "Покупатель": "recXXXXXXXXXXXXX",
  "ID курса": "recc4DgQg3Q7dcuL4",
  "Бонусы начислить": 420
}

// Обновить бонусы пользователя
PATCH http://nocodb:8080/api/v1/db/data/v1/{project}/Users/{recordId}
Body: {
  "Бонусы": 1150
}
```

---

## РЕФЕРАЛЬНАЯ СИСТЕМА

### Логика работы:

1. **Генерация реферальной ссылки:**
```
https://e-budget.ru/members/signup?utm_source={USER_ID}&utm_medium=referral&utm_campaign=friends
```

2. **Регистрация по реферальной ссылке:**
- Тільда отправляет webhook с параметром `utm_source`
- Создаём пользователя и заполняем поле "Кто привёл" = `utm_source`

3. **Начисление бонусов:**
- При покупке: +300 бонусов покупателю
- Если есть реферал: +100 бонусов рефералу

---

## ТРЕБОВАНИЯ

1. **Backend:**
   - Node.js + Express
   - Работа с NocoDB API
   - CORS для запросов с Тільды
   - Обработка webhooks

2. **JS Виджет:**
   - Vanilla JavaScript (без фреймворков)
   - Совместимость с jQuery (Тільда использует jQuery)
   - Работа с localStorage
   - Поддержка пагинации

3. **Интеграция:**
   - Использовать существующие блоки Тільды (T431, T123)
   - Не ломать текущий дизайн
   - Мобильная адаптация

---

## ЧТО НУЖНО ОТ ТЕБЯ

### Этап 1: Backend API
Напиши код для Node.js + Express сервера:
1. `server.js` — главный файл с Express
2. `config.js` — конфигурация (NocoDB URL, токен)
3. `services/nocodb.js` — модуль для работы с NocoDB API
4. `routes/widget.js` — endpoints для виджетов
5. `routes/webhook.js` — обработка webhooks от Тільды

### Этап 2: JS Виджет
Напиши два виджета:
1. `widget-table.js` — таблица курсов с пагинацией
2. `widget-cards.js` — карточки с реферальной информацией

### Этап 3: Docker Compose
Напиши `docker-compose.yml` для развёртывания:
- PostgreSQL
- NocoDB
- API сервер
- Nginx (для статики виджетов)

---

## НАЧНИ С ЭТОГО

1. Создай структуру проекта
2. Напиши `config.js` с настройками NocoDB
3. Напиши `services/nocodb.js` с функциями:
   - `getUserByEmail(email)`
   - `getUserCourses(userId)`
   - `createPurchase(data)`
   - `updateUserBonuses(userId, bonuses)`
4. Напиши endpoint `POST /api/widget/courses`

Начинай с первого этапа. Пиши код поэтапно, чтобы я мог тестировать.
