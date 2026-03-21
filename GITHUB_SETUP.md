# 📦 Публикация проекта на GitHub

## Быстрая публикация (автоматический скрипт)

### Для Windows (PowerShell):
```powershell
.\git-push.ps1
```

### Для Linux/Mac/Git Bash:
```bash
./git-push.sh
```

Скрипт автоматически:
1. ✅ Инициализирует Git репозиторий
2. ✅ Добавит все файлы
3. ✅ Создаст первый коммит
4. ✅ Настроит remote на GitHub
5. ✅ Запушит код

---

## Ручная публикация (пошагово)

### Шаг 1: Создать репозиторий на GitHub

1. Открыть https://github.com/new
2. Заполнить:
   - **Repository name:** `e-budget-backend`
   - **Description:** `Self-hosted замена Collabza + Airtable + Make на NocoDB`
   - **Visibility:** Public или Private
   - ❌ **НЕ добавляйте** README, .gitignore, license (они уже есть)
3. Нажать **Create repository**

### Шаг 2: Инициализировать Git локально

```bash
cd C:\projects\budjet

# Инициализировать Git
git init

# Добавить все файлы
git add .

# Создать первый коммит
git commit -m "Initial commit: E-Budget Backend v1.0.0

- Backend API (Node.js + Express)
- Frontend виджеты (JavaScript)
- Docker Compose конфигурация
- Полная документация (17 файлов)
- Готово к использованию"
```

### Шаг 3: Подключить GitHub репозиторий

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/e-budget-backend.git

# Переименовать ветку в main
git branch -M main

# Запушить код
git push -u origin main
```

### Шаг 4: Проверить на GitHub

Открыть: https://github.com/YOUR_USERNAME/e-budget-backend

Должны увидеть все файлы проекта!

---

## 🎨 Настройка репозитория

### Добавить описание и topics

1. На странице репозитория нажать **⚙️** (Settings)
2. В разделе **About** нажать **⚙️**
3. Заполнить:
   - **Description:** `Self-hosted замена Collabza + Airtable + Make на NocoDB для личных кабинетов на Tilda`
   - **Website:** `https://your-domain.ru` (если есть)
   - **Topics:** 
     - `nodejs`
     - `express`
     - `nocodb`
     - `tilda`
     - `docker`
     - `self-hosted`
     - `personal-cabinet`
     - `referral-system`
4. Сохранить

### Создать первый релиз

1. На странице репозитория нажать **Releases** → **Create a new release**
2. Заполнить:
   - **Tag:** `v1.0.0`
   - **Release title:** `v1.0.0 - Первый релиз`
   - **Description:** 
     ```markdown
     ## 🎉 Первый релиз E-Budget Backend
     
     ### Что включено:
     
     ✅ **Backend API** (Node.js + Express)
     - 10+ API endpoints
     - Интеграция с NocoDB
     - Реферальная система
     - Webhooks от Tilda
     
     ✅ **Frontend виджеты** (JavaScript)
     - Таблица курсов с пагинацией
     - Реферальная информация
     - Профиль пользователя
     
     ✅ **Infrastructure**
     - Docker Compose
     - PostgreSQL 15
     - NocoDB latest
     - Nginx Alpine
     
     ✅ **Документация**
     - 17 документов на русском
     - Быстрый старт за 15 минут
     - Полное руководство
     - Примеры использования
     
     ### Установка:
     
     ```bash
     git clone https://github.com/YOUR_USERNAME/e-budget-backend.git
     cd e-budget-backend
     docker-compose up -d
     ```
     
     Подробнее: [START_HERE.md](START_HERE.md)
     ```
3. Нажать **Publish release**

---

## 🔐 Настройка SSH (рекомендуется)

### Зачем нужен SSH?
- Не нужно вводить пароль при каждом push
- Более безопасно
- Работает быстрее

### Генерация SSH ключа

```bash
# Сгенерировать ключ
ssh-keygen -t ed25519 -C "your_email@example.com"

# Нажать Enter 3 раза (использовать значения по умолчанию)

# Скопировать публичный ключ
cat ~/.ssh/id_ed25519.pub
```

### Добавление ключа на GitHub

1. Открыть GitHub → Settings → SSH and GPG keys
2. Нажать **New SSH key**
3. Заполнить:
   - **Title:** `My Computer`
   - **Key:** вставить содержимое из `id_ed25519.pub`
4. Нажать **Add SSH key**

### Изменить remote на SSH

```bash
# Удалить старый remote
git remote remove origin

# Добавить SSH remote
git remote add origin git@github.com:YOUR_USERNAME/e-budget-backend.git

# Проверить
git remote -v
```

Теперь можно пушить без пароля:
```bash
git push
```

---

## 📝 Работа с Git

### Обновление кода

```bash
# Проверить изменения
git status

# Добавить изменённые файлы
git add .

# Создать коммит
git commit -m "feat: add email notifications"

# Запушить
git push
```

### Создание веток

```bash
# Создать новую ветку
git checkout -b feature/new-feature

# Работать в ветке
git add .
git commit -m "feat: implement new feature"

# Запушить ветку
git push -u origin feature/new-feature
```

Затем создать Pull Request на GitHub.

### Синхронизация с GitHub

```bash
# Получить изменения
git pull

# Или
git fetch
git merge origin/main
```

---

## 🚨 Важные правила

### ❌ НЕ коммитить:

- `.env` файлы с секретами
- `node_modules/`
- Логи
- Бэкапы баз данных
- SSL сертификаты
- Пароли и токены

Всё это уже в `.gitignore`!

### ✅ Проверить перед пушем:

```bash
# Проверить что в .gitignore
cat .gitignore

# Проверить что будет закоммичено
git status

# Проверить что .env не добавлен
git ls-files | grep .env
```

Должно быть пусто! Если видите `.env` - удалите его:
```bash
git rm --cached backend/.env
git commit -m "Remove .env from git"
```

---

## 🎯 Чек-лист публикации

- [ ] Создан репозиторий на GitHub
- [ ] Git инициализирован локально
- [ ] Все файлы добавлены (git add .)
- [ ] Создан первый коммит
- [ ] Remote настроен
- [ ] Код запушен на GitHub
- [ ] .env файлы НЕ в репозитории
- [ ] README.md отображается корректно
- [ ] Добавлено описание репозитория
- [ ] Добавлены topics
- [ ] Создан релиз v1.0.0
- [ ] LICENSE файл на месте

---

## 📞 Помощь

### Ошибка: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/e-budget-backend.git
```

### Ошибка: "failed to push"

```bash
# Проверить что репозиторий создан на GitHub
# Проверить username в URL
git remote -v

# Попробовать с force (ОСТОРОЖНО!)
git push -f origin main
```

### Ошибка: "Permission denied"

Настройте SSH ключ (см. выше) или используйте Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Выбрать scopes: `repo`
4. Скопировать токен
5. Использовать вместо пароля при push

---

## 🔗 Полезные ссылки

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Готово! Ваш проект теперь на GitHub! 🎉**
