# 🚀 Быстрый старт E-Budget Backend

## За 15 минут от нуля до работающей системы

---

## Шаг 1: Подготовка (2 минуты)

### Что нужно установить:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
- Текстовый редактор (VS Code, Notepad++)

### Проверка установки:
```bash
docker --version
docker-compose --version
```

---

## Шаг 2: Запуск сервисов (3 минуты)

### 1. Скачать проект
```bash
cd C:\projects\budjet
```

### 2. Создать .env файл
```bash
# Скопировать пример
copy backend\.env.example backend\.env
```

### 3. Запустить Docker Compose
```bash
docker-compose up -d
```

Подождать 1-2 минуты пока запустятся все сервисы.

### 4. Проверить что всё работает
```bash
docker-compose ps
```

Должны быть запущены:
- ✅ ebudget_postgres
- ✅ ebudget_nocodb
- ✅ ebudget_api
- ✅ ebudget_nginx

---

## Шаг 3: Настройка NocoDB (5 минут)

### 1. Открыть NocoDB
Перейти в браузере: http://localhost:8080

### 2. Создать аккаунт
- Email: admin@e-budget.ru
- Пароль: (придумать надёжный)

### 3. Создать проект
- Нажать "New Project"
- Название: **E-Budget**
- Нажать "Create"

### 4. Импортировать данные

#### Таблица Users:
1. Нажать "+ Add new table"
2. Выбрать "Import from CSV"
3. Загрузить файл `Users-Grid view.csv`
4. Название таблицы: **Users**
5. Нажать "Import"

#### Таблица Курсы:
1. Повторить для `Курсы-Grid view.csv`
2. Название: **Курсы**

#### Таблица Покупки:
1. Повторить для `Покупки-Grid view.csv`
2. Название: **Покупки**

### 5. Настроить связи

#### Users → Покупки:
1. Открыть таблицу **Покупки**
2. Найти колонку "Покупатель"
3. Тип: Link to another record
4. Связать с таблицей **Users**

#### Покупки → Курсы:
1. Найти колонку "ID курса"
2. Связать с таблицей **Курсы**

#### Users → Курсы:
1. Открыть таблицу **Users**
2. Найти колонку "Курсы_link"
3. Связать с таблицей **Курсы**

### 6. Получить API токен
1. Нажать на аватар (правый верхний угол)
2. Settings → API Tokens
3. Нажать "+ Create Token"
4. Название: "Backend API"
5. Скопировать токен (сохранить!)

### 7. Получить Project ID
Посмотреть в URL браузера:
```
http://localhost:8080/nc/p01234567890abcdef
                          ↑ это Project ID
```

---

## Шаг 4: Настройка Backend (2 минуты)

### 1. Открыть файл backend/.env
```bash
notepad backend\.env
```

### 2. Вставить данные из NocoDB
```env
NOCODB_URL=http://nocodb:8080
NOCODB_TOKEN=ваш-токен-из-шага-3.6
NOCODB_PROJECT_ID=ваш-project-id-из-шага-3.7

PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://e-budget.ru,http://localhost
PURCHASE_BONUS=300
REFERRAL_BONUS=100
```

### 3. Перезапустить API
```bash
docker-compose restart api
```

### 4. Проверить работу
Открыть в браузере: http://localhost:3000/health

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T...",
  "environment": "production"
}
```

---

## Шаг 5: Настройка виджетов (3 минуты)

### 1. Узнать ваш внешний IP или домен
Если у вас есть домен: `https://your-domain.ru`
Если нет: `http://ваш-ip-адрес`

### 2. Обновить URL в виджетах

#### widget/js/widget-table.js:
```javascript
const CONFIG = {
  API_URL: 'https://your-domain.ru/api',  // ← ИЗМЕНИТЬ
  // ...
};
```

#### widget/js/widget-cards.js:
```javascript
const CONFIG = {
  API_URL: 'https://your-domain.ru/api',  // ← ИЗМЕНИТЬ
  // ...
};
```

### 3. Загрузить виджеты на сервер
Скопировать папку `widget/` на ваш сервер или хостинг.

---

## Шаг 6: Интеграция с Тільдой (5 минут)

### 1. Открыть страницу личного кабинета в редакторе Тільды

### 2. Добавить HTML-блок (T123)

### 3. Вставить код для таблицы курсов:

```html
<!-- jQuery (если ещё не подключен) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Стили виджета -->
<link rel="stylesheet" href="https://your-domain.ru/widget/css/widget.css">

<!-- Виджет таблицы курсов -->
<script src="https://your-domain.ru/widget/js/widget-table.js"></script>

<!-- Блок T431 для отображения -->
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
```

### 4. Для реферальной информации добавить ещё один HTML-блок:

```html
<!-- Виджет реферальной информации -->
<script src="https://your-domain.ru/widget/js/widget-cards.js"></script>

<!-- Блок T123 для отображения -->
<div id="rec556083146" class="r_hidden">
  <div class="t123">
    <div>
      <div>
        <!-- Сюда вставится HTML -->
      </div>
    </div>
  </div>
</div>
```

### 5. Настроить webhook для покупок

1. Зайти в настройки формы оплаты на Тільде
2. Webhooks → Добавить webhook
3. URL: `https://your-domain.ru/api/webhook/tilda`
4. События: "Успешная оплата"
5. Сохранить

---

## ✅ Проверка работы

### 1. Проверить API
```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d "{\"user_email\":\"bazeeva@inbox.ru\",\"offset\":0,\"limit\":10}"
```

Должен вернуть список курсов.

### 2. Проверить виджет на Тільде
1. Открыть страницу личного кабинета
2. Войти под тестовым пользователем
3. Должна отобразиться таблица с курсами

### 3. Проверить webhook
1. Сделать тестовую покупку на Тільде
2. Проверить логи API:
```bash
docker-compose logs -f api
```
3. Проверить что покупка появилась в NocoDB

---

## 🎉 Готово!

Теперь у вас работает:
- ✅ NocoDB с вашими данными
- ✅ Backend API для обработки запросов
- ✅ JS виджеты на Тільде
- ✅ Webhooks для автоматической обработки покупок
- ✅ Реферальная система с начислением бонусов

---

## 🔧 Что дальше?

### Для продакшена:
1. Настроить HTTPS (Let's Encrypt)
2. Настроить резервное копирование БД
3. Настроить мониторинг (Grafana + Prometheus)
4. Добавить Telegram уведомления

### Для улучшения:
1. Добавить админ-панель
2. Добавить экспорт данных
3. Добавить аналитику
4. Добавить email рассылки

---

## 🆘 Помощь

### Проблемы?

**Виджет не загружается:**
```bash
# Проверить логи
docker-compose logs -f api

# Проверить CORS
# Открыть консоль браузера (F12)
```

**NocoDB не запускается:**
```bash
# Проверить логи PostgreSQL
docker-compose logs -f postgres

# Перезапустить
docker-compose restart nocodb
```

**API не отвечает:**
```bash
# Проверить health check
curl http://localhost:3000/health

# Проверить .env файл
cat backend/.env
```

---

## 📞 Контакты

Если что-то не работает - проверьте:
1. Логи: `docker-compose logs -f`
2. Health check: `http://localhost:3000/health`
3. NocoDB: `http://localhost:8080`
