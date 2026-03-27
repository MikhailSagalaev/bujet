# Чеклист: Что делает скрипт setup-nocodb.js

## Таблица Users

### Базовые поля (создаются автоматически при создании таблицы)
- ✅ Id (системное, автоматическое)
- ✅ CreatedAt (системное, автоматическое)
- ✅ UpdatedAt (системное, автоматическое)
- ✅ Имя (SingleLineText)
- ✅ Email (Email, unique)
- ✅ Тариф (SingleSelect: '🥈Базовый', '🥇Про')
- ✅ Дата продления (DateTime)
- ✅ Количество рефералов (Number, default: 0)
- ✅ Оплатили подписку (Number, default: 0)
- ✅ Бонусы (Number, default: 0)

### Формульные поля (создаются скриптом)
- ✅ html_psy (Formula)
- ✅ Реферальная ссылка1 (Formula) — использует {Id}
- ✅ Tilda Статус подписки (Formula)
- ✅ Code_block (Formula)
- ✅ Dashboard (Formula)
- ✅ Списать бонусы (Formula)
- ✅ status_prof (Formula) — зависит от "Tilda Статус подписки"
- ✅ HTML_ADD (Formula) — зависит от других формул

### Связи (создаются скриптом)
- ✅ Кто привёл (LinkToAnotherRecord → Users, Many to Many)
- ✅ Покупки (LinkToAnotherRecord → Purchases, автоматически создаётся при создании связи в Purchases)

### Lookup поля (НЕ создаются скриптом, нужно вручную)
- ⚠️ Email (from Кто привёл) — Lookup from "Кто привёл" → Email
- ⚠️ Курсы_link — Lookup from "Покупки" → "Название курса"

### Rollup поля (НЕ создаются скриптом, нужно вручную)
- ⚠️ Покупки друзей — Rollup from "Кто привёл" (обратная связь) → COUNT(Покупки)

---

## Таблица Courses

### Базовые поля
- ✅ Id (системное)
- ✅ CreatedAt (системное)
- ✅ UpdatedAt (системное)
- ✅ Название (SingleLineText)
- ✅ Ссылка (URL)
- ✅ date (DateTime)
- ✅ Дата (DateTime) — дубликат date

### Формульные поля
- ✅ Tilda_Ссылка (Formula)

### Связи
- ✅ Users (LinkToAnotherRecord → Users, автоматически создаётся при создании связи в Purchases)

### Lookup поля (НЕ создаются скриптом)
- ⚠️ Email (from Users) — Lookup from "Users" → Email

---

## Таблица Purchases

### Базовые поля
- ✅ Id (системное)
- ✅ CreatedAt (системное)
- ✅ UpdatedAt (системное)
- ✅ Email (Email)
- ✅ order_id (SingleLineText)
- ✅ Оплата (SingleSelect: 'Да', 'Нет')
- ✅ Бонусы списать (Number)
- ✅ Бонусы начислить (Number)
- ✅ Название курса (SingleLineText)
- ✅ Date (DateTime)
- ✅ Дата создания (SingleLineText) — текстовое представление даты

### Связи
- ✅ Покупатель (LinkToAnotherRecord → Users, Has Many)
- ✅ ID курса (LinkToAnotherRecord → Courses, Has Many)

### Lookup поля (НЕ создаются скриптом)
- ⚠️ Имя (from Покупатель) — Lookup from "Покупатель" → Имя
- ⚠️ Calculation — Lookup from "Покупатель" → Имя (дубликат)
- ⚠️ Друг — Lookup from "Покупатель" → "Кто привёл"
- ⚠️ Email друга — Lookup from "Друг" → Email

---

## Что НЕ делает скрипт (нужно настроить вручную)

### 1. Lookup поля
Lookup поля создаются только после того, как связи уже существуют. Их нужно создать вручную в UI NocoDB.

**В таблице Users:**
- Email (from Кто привёл)
- Курсы_link

**В таблице Courses:**
- Email (from Users)

**В таблице Purchases:**
- Имя (from Покупатель)
- Calculation
- Друг
- Email друга

### 2. Rollup поля
**В таблице Users:**
- Покупки друзей

### 3. Импорт данных
Скрипт может импортировать данные из CSV, но:
- Связи между записями не импортируются (нужно настраивать вручную)
- Lookup и Rollup поля не заполнятся автоматически

---

## Рекомендации

1. **Запусти скрипт без импорта данных:**
   ```bash
   node scripts/setup-nocodb.js
   ```

2. **Проверь созданные таблицы в NocoDB**

3. **Создай Lookup поля вручную** (если нужны)

4. **Импортируй данные через UI NocoDB** или используй скрипт с флагом:
   ```bash
   node scripts/setup-nocodb.js --import-data
   ```

5. **Настрой связи между записями вручную** (если импортировал данные)

---

## Проверка после запуска

### Таблица Users
- [ ] Поле "Реферальная ссылка1" показывает ссылку с {Id}
- [ ] Поле "Dashboard" показывает HTML код
- [ ] Поле "Кто привёл" позволяет выбрать другого пользователя
- [ ] Формулы работают без ошибок

### Таблица Courses
- [ ] Поле "Tilda_Ссылка" показывает "Перейти button=..."
- [ ] Поле "Ссылка" имеет тип URL

### Таблица Purchases
- [ ] Поле "Покупатель" позволяет выбрать пользователя
- [ ] Поле "ID курса" позволяет выбрать курс
- [ ] Поле "Оплата" имеет опции "Да" и "Нет"
