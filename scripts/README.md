# Скрипт автоматической настройки NocoDB

## Что делает скрипт

Скрипт `setup-nocodb.js` автоматически:
1. ✅ Создаёт таблицы Users, Courses, Purchases
2. ✅ Настраивает типы полей (Email, Number, DateTime, SingleSelect)
3. ✅ Создаёт все формульные поля с правильными формулами
4. ✅ Настраивает связи между таблицами (LinkToAnotherRecord)
5. ✅ Опционально импортирует данные из CSV

## Установка зависимостей

```bash
cd /opt/bujet
npm install axios
```

## Использование

### Вариант 1: Только создание структуры (без данных)

```bash
node scripts/setup-nocodb.js
```

### Вариант 2: Создание структуры + импорт данных

```bash
node scripts/setup-nocodb.js --import-data
```

## Переменные окружения

Скрипт использует переменные из `.env` или значения по умолчанию:

```bash
NOCODB_URL=http://localhost:8080
NOCODB_TOKEN=wOYmcdqxhT91pYQ1OhIQXQXGkyIAjkMTVXsBlUzs
NOCODB_PROJECT_ID=p0o848dnq1jfzu0
NOCODB_BASE_ID=p0o848dnq1jfzu0
```

## Запуск на сервере

```bash
# Подключись к серверу
ssh root@194.67.101.79

# Перейди в директорию проекта
cd /opt/bujet

# Запусти скрипт
node scripts/setup-nocodb.js

# Или с импортом данных
node scripts/setup-nocodb.js --import-data
```

## Что делать после запуска

1. Скрипт выведет ID созданных таблиц:
   ```
   📊 Созданные таблицы:
     - Users: mv805taz8y6rws9
     - Courses: mc1fdmzb4zs2om7
     - Purchases: mkovcnkg9deyy80
   ```

2. Обнови `backend/config.js` с новыми ID:
   ```javascript
   tables: {
     users: 'mv805taz8y6rws9',
     courses: 'mc1fdmzb4zs2om7',
     purchases: 'mkovcnkg9deyy80'
   }
   ```

3. Перезапусти API контейнер:
   ```bash
   docker-compose restart api
   ```

## Проверка результата

1. Зайди в NocoDB: https://app.e-budget.ru/nocodb/
2. Открой таблицу Users
3. Проверь, что:
   - Все поля созданы
   - Формулы работают (открой любую запись)
   - Связи настроены (поле "Кто привёл" показывает список пользователей)

## Устранение проблем

### Ошибка "Table already exists"
Скрипт автоматически пропустит создание существующих таблиц.

### Ошибка "Column already exists"
Скрипт автоматически пропустит создание существующих полей.

### Ошибка подключения
Проверь, что NocoDB запущен:
```bash
docker ps | grep nocodb
```

### Ошибка токена
Проверь токен в `.env` или передай через переменную окружения:
```bash
NOCODB_TOKEN=твой_токен node scripts/setup-nocodb.js
```

## Примечания

- Скрипт использует системное поле `Id` для реферальных ссылок (вместо `rec1`, `rec2` будет `1`, `2`)
- Если нужен префикс "rec", добавь формульное поле `ID` с формулой `CONCAT("rec", {Id})`
- Импорт данных работает только для простых CSV (без связей)
- Связи между записями нужно настраивать вручную после импорта
