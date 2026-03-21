# 🤝 Руководство по внесению вклада

Спасибо за интерес к проекту E-Budget Backend! Мы рады любому вкладу.

---

## 📋 Содержание

- [Кодекс поведения](#кодекс-поведения)
- [Как внести вклад](#как-внести-вклад)
- [Процесс разработки](#процесс-разработки)
- [Стиль кода](#стиль-кода)
- [Тестирование](#тестирование)
- [Документация](#документация)
- [Коммиты](#коммиты)
- [Pull Requests](#pull-requests)

---

## 🤝 Кодекс поведения

### Наши стандарты

Мы стремимся создать открытое и дружелюбное сообщество. Мы ожидаем:

✅ **Делайте:**
- Будьте уважительны к другим участникам
- Принимайте конструктивную критику
- Фокусируйтесь на том, что лучше для сообщества
- Проявляйте эмпатию к другим

❌ **Не делайте:**
- Не используйте сексуализированный язык или образы
- Не троллите и не оскорбляйте
- Не публикуйте личную информацию других
- Не ведите себя непрофессионально

---

## 🎯 Как внести вклад

### Типы вклада

Мы принимаем различные типы вклада:

1. **Код**
   - Новый функционал
   - Исправление багов
   - Оптимизация производительности
   - Рефакторинг

2. **Документация**
   - Улучшение существующей документации
   - Добавление примеров
   - Перевод на другие языки
   - Исправление опечаток

3. **Тестирование**
   - Написание тестов
   - Тестирование новых функций
   - Отчёты об ошибках

4. **Дизайн**
   - UI/UX улучшения
   - Иконки и графика
   - Стили виджетов

5. **Идеи**
   - Предложения новых функций
   - Улучшения архитектуры
   - Обратная связь

---

## 🔄 Процесс разработки

### 1. Найдите задачу

Выберите одно из:
- Открытые [Issues](https://github.com/your-repo/e-budget-backend/issues)
- Задачи с меткой `good first issue`
- Задачи с меткой `help wanted`
- Или создайте новую задачу

### 2. Обсудите

Перед началом работы:
- Прокомментируйте issue что берёте задачу
- Обсудите подход к решению
- Получите одобрение от мейнтейнеров

### 3. Форкните репозиторий

```bash
# Форкните через GitHub UI
# Затем клонируйте свой форк
git clone https://github.com/your-username/e-budget-backend.git
cd e-budget-backend

# Добавьте upstream
git remote add upstream https://github.com/original-repo/e-budget-backend.git
```

### 4. Создайте ветку

```bash
# Обновите main
git checkout main
git pull upstream main

# Создайте ветку
git checkout -b feature/your-feature-name
# или
git checkout -b fix/bug-description
```

**Именование веток:**
- `feature/` - новый функционал
- `fix/` - исправление бага
- `docs/` - документация
- `refactor/` - рефакторинг
- `test/` - тесты

### 5. Разработка

```bash
# Установите зависимости
cd backend
npm install

# Запустите в режиме разработки
npm run dev

# Или через Docker
docker-compose up -d
```

### 6. Тестирование

```bash
# Запустите тесты
npm test

# Проверьте линтер
npm run lint

# Проверьте форматирование
npm run format
```

### 7. Коммит

```bash
git add .
git commit -m "feat: add email notifications"
```

### 8. Push

```bash
git push origin feature/your-feature-name
```

### 9. Pull Request

Создайте PR через GitHub UI.

---

## 💻 Стиль кода

### JavaScript

Мы используем стандартный стиль JavaScript:

```javascript
// ✅ Хорошо
function getUserByEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }
  
  return database.query('SELECT * FROM users WHERE email = ?', [email]);
}

// ❌ Плохо
function getUserByEmail(email){
    if(!email){throw new Error('Email is required')}
    return database.query('SELECT * FROM users WHERE email = ?',[email])
}
```

**Правила:**
- Используйте 2 пробела для отступов
- Используйте одинарные кавычки для строк
- Точка с запятой обязательна
- Максимальная длина строки: 100 символов
- Используйте `const` и `let`, не `var`
- Используйте стрелочные функции где возможно

### Именование

```javascript
// Переменные и функции: camelCase
const userName = 'John';
function getUserData() {}

// Классы: PascalCase
class UserService {}

// Константы: UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com';

// Приватные методы: _camelCase
function _privateMethod() {}
```

### Комментарии

```javascript
/**
 * Получить пользователя по email
 * @param {string} email - Email пользователя
 * @returns {Promise<Object>} Объект пользователя
 */
async function getUserByEmail(email) {
  // Валидация email
  if (!isValidEmail(email)) {
    throw new Error('Invalid email');
  }
  
  // Запрос к базе данных
  const user = await db.query('...');
  
  return user;
}
```

### Обработка ошибок

```javascript
// ✅ Хорошо
try {
  const user = await getUserByEmail(email);
  return user;
} catch (error) {
  console.error('Error getting user:', error);
  throw error;
}

// ❌ Плохо
try {
  const user = await getUserByEmail(email);
  return user;
} catch (error) {
  // Пустой catch
}
```

---

## 🧪 Тестирование

### Написание тестов

Каждая новая функция должна иметь тесты:

```javascript
// backend/tests/services/nocodb.test.js
const nocodbService = require('../../services/nocodb');

describe('NocoDBService', () => {
  describe('getUserByEmail', () => {
    it('should return user when email exists', async () => {
      const user = await nocodbService.getUserByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user.Email).toBe('test@example.com');
    });
    
    it('should return null when email does not exist', async () => {
      const user = await nocodbService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
    
    it('should throw error on invalid email', async () => {
      await expect(
        nocodbService.getUserByEmail('invalid-email')
      ).rejects.toThrow();
    });
  });
});
```

### Запуск тестов

```bash
# Все тесты
npm test

# Конкретный файл
npm test -- nocodb.test.js

# С покрытием
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Минимальное покрытие

- Общее покрытие: 80%
- Критические функции: 100%

---

## 📚 Документация

### Обновление документации

При добавлении нового функционала обновите:

1. **README.md** - если изменился API или установка
2. **EXAMPLES.md** - добавьте примеры использования
3. **API.md** - документируйте новые endpoints
4. **CHANGELOG.md** - добавьте запись об изменении

### Формат документации

```markdown
## Название функции

Краткое описание что делает функция.

### Параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| email | string | Да | Email пользователя |
| offset | number | Нет | Смещение для пагинации |

### Возвращает

`Promise<Object>` - Объект пользователя

### Пример

\`\`\`javascript
const user = await getUserByEmail('test@example.com');
console.log(user.name);
\`\`\`

### Ошибки

- `InvalidEmailError` - если email невалидный
- `UserNotFoundError` - если пользователь не найден
```

---

## 📝 Коммиты

### Формат commit сообщений

Мы используем [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat` - новый функционал
- `fix` - исправление бага
- `docs` - документация
- `style` - форматирование
- `refactor` - рефакторинг
- `test` - тесты
- `chore` - обновление зависимостей

**Scope (опционально):**
- `api` - backend API
- `widget` - frontend виджеты
- `docs` - документация
- `config` - конфигурация

**Примеры:**

```bash
# Новый функционал
git commit -m "feat(api): add email notifications"

# Исправление бага
git commit -m "fix(widget): resolve CORS issue"

# Документация
git commit -m "docs: update README with new examples"

# Рефакторинг
git commit -m "refactor(api): simplify error handling"

# Тесты
git commit -m "test(api): add tests for webhook handler"
```

### Правила коммитов

- Используйте настоящее время ("add feature" не "added feature")
- Используйте повелительное наклонение ("move cursor to..." не "moves cursor to...")
- Первая строка не более 72 символов
- Ссылайтесь на issues: `fix #123`

---

## 🔀 Pull Requests

### Создание PR

1. **Заголовок**
   ```
   feat(api): add email notifications
   ```

2. **Описание**
   ```markdown
   ## Что изменено
   
   - Добавлена отправка email уведомлений
   - Настроен nodemailer
   - Добавлены шаблоны писем
   
   ## Зачем
   
   Пользователи просили получать уведомления о покупках
   
   ## Как протестировать
   
   1. Настроить SMTP в .env
   2. Сделать тестовую покупку
   3. Проверить email
   
   ## Скриншоты
   
   ![Email notification](screenshot.png)
   
   ## Checklist
   
   - [x] Код написан
   - [x] Тесты добавлены
   - [x] Документация обновлена
   - [x] CHANGELOG обновлён
   
   Closes #123
   ```

### Чек-лист PR

Перед созданием PR убедитесь:

- [ ] Код соответствует стилю проекта
- [ ] Все тесты проходят
- [ ] Добавлены новые тесты (если нужно)
- [ ] Документация обновлена
- [ ] CHANGELOG.md обновлён
- [ ] Нет конфликтов с main
- [ ] Коммиты имеют правильный формат
- [ ] PR имеет понятное описание

### Процесс ревью

1. **Автоматические проверки**
   - Линтер
   - Тесты
   - Покрытие кода

2. **Code review**
   - Минимум 1 одобрение от мейнтейнера
   - Все комментарии должны быть решены

3. **Merge**
   - Используем "Squash and merge"
   - Удаляем ветку после merge

---

## 🐛 Отчёты об ошибках

### Как сообщить об ошибке

Создайте [issue](https://github.com/your-repo/e-budget-backend/issues/new) с:

**Заголовок:**
```
[Bug] Краткое описание проблемы
```

**Описание:**
```markdown
## Описание
Что произошло и что ожидалось

## Шаги для воспроизведения
1. Запустить сервер
2. Отправить запрос...
3. Увидеть ошибку

## Ожидаемое поведение
Что должно было произойти

## Фактическое поведение
Что произошло на самом деле

## Окружение
- OS: Ubuntu 20.04
- Node.js: 18.16.0
- Docker: 24.0.0
- Версия проекта: 1.0.0

## Логи
\`\`\`
Error: Cannot connect to NocoDB
    at NocoDBService.getUserByEmail
    ...
\`\`\`

## Скриншоты
![Error screenshot](error.png)
```

---

## 💡 Предложения функций

### Как предложить новую функцию

Создайте [issue](https://github.com/your-repo/e-budget-backend/issues/new) с:

**Заголовок:**
```
[Feature] Название функции
```

**Описание:**
```markdown
## Проблема
Какую проблему решает эта функция

## Решение
Как вы предлагаете решить проблему

## Альтернативы
Какие ещё варианты рассматривали

## Дополнительный контекст
Скриншоты, примеры, ссылки
```

---

## 📞 Связь

### Каналы коммуникации

- **GitHub Issues** - баги и предложения
- **GitHub Discussions** - общие вопросы
- **Email** - support@e-budget.ru
- **Telegram** - @ebudget_support

### Время ответа

- Issues: 1-3 дня
- Pull Requests: 1-5 дней
- Email: 1-7 дней

---

## 🎓 Ресурсы для новичков

### Полезные ссылки

- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)

### Задачи для новичков

Ищите issues с метками:
- `good first issue` - простые задачи
- `help wanted` - нужна помощь
- `documentation` - документация

---

## 🏆 Признание

Все контрибьюторы будут добавлены в:
- README.md (секция Contributors)
- CHANGELOG.md (секция Thanks)
- Страница проекта на GitHub

---

## 📜 Лицензия

Внося вклад в проект, вы соглашаетесь что ваш код будет лицензирован под [MIT License](LICENSE).

---

**Спасибо за вклад в E-Budget Backend! 🎉**

Если у вас есть вопросы, не стесняйтесь спрашивать в [Discussions](https://github.com/your-repo/e-budget-backend/discussions).
