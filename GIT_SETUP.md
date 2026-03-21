# 🔧 Настройка Git и публикация на GitHub

## Пошаговая инструкция

---

## Шаг 1: Инициализация Git репозитория

```bash
# Перейти в папку проекта
cd C:\projects\budjet

# Инициализировать Git
git init

# Проверить статус
git status
```

---

## Шаг 2: Добавить все файлы

```bash
# Добавить все файлы
git add .

# Проверить что добавлено
git status
```

---

## Шаг 3: Создать первый коммит

```bash
# Создать коммит
git commit -m "Initial commit: E-Budget Backend v1.0.0

- Backend API (Node.js + Express)
- Frontend виджеты (JavaScript)
- Docker Compose конфигурация
- Полная документация (17 файлов)
- Готово к использованию"
```

---

## Шаг 4: Создать репозиторий на GitHub

### Вариант A: Через веб-интерфейс

1. Открыть https://github.com
2. Нажать "+" → "New repository"
3. Заполнить:
   - **Repository name:** `e-budget-backend`
   - **Description:** `Self-hosted замена Collabza + Airtable для личных кабинетов на Тільде`
   - **Public** или **Private** (на ваш выбор)
   - ❌ НЕ добавляйте README, .gitignore, license (они уже есть)
4. Нажать "Create repository"

### Вариант B: Через GitHub CLI

```bash
# Установить GitHub CLI (если ещё не установлен)
# https://cli.github.com/

# Авторизоваться
gh auth login

# Создать репозиторий
gh repo create e-budget-backend --public --source=. --remote=origin
```

---

## Шаг 5: Подключить удалённый репозиторий

```bash
# Добавить remote (замените YOUR_USERNAME на ваш username)
git remote add origin https://github.com/YOUR_USERNAME/e-budget-backend.git

# Проверить
git remote -v
```

---

## Шаг 6: Запушить код

```bash
# Переименовать ветку в main (если нужно)
git branch -M main

# Запушить
git push -u origin main
```

---

## Шаг 7: Проверить на GitHub

Открыть: https://github.com/YOUR_USERNAME/e-budget-backend

Должны увидеть все файлы проекта!

---

## 🎉 Готово!

Теперь ваш проект на GitHub!

---

## 📝 Дополнительные настройки

### Добавить описание репозитория

На странице репозитория:
1. Нажать "⚙️" (Settings)
2. В разделе "About" нажать "⚙️"
3. Заполнить:
   - **Description:** `Self-hosted замена Collabza + Airtable + Make на NocoDB`
   - **Website:** `https://your-domain.ru` (если есть)
   - **Topics:** `nodejs`, `express`, `nocodb`, `tilda`, `docker`, `self-hosted`
4. Сохранить

### Добавить README badge

Добавить в начало README.md:

```markdown
# E-Budget Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
```

### Настроить GitHub Pages (опционально)

Для документации:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /docs
4. Save

---

## 🔄 Дальнейшая работа с Git

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

# Создать Pull Request на GitHub
```

### Синхронизация

```bash
# Получить изменения
git pull

# Или
git fetch
git merge origin/main
```

---

## 🏷️ Создание релиза

### Через веб-интерфейс

1. Открыть репозиторий на GitHub
2. Нажать "Releases" → "Create a new release"
3. Заполнить:
   - **Tag:** `v1.0.0`
   - **Title:** `v1.0.0 - Первый релиз`
   - **Description:** Скопировать из CHANGELOG.md
4. Нажать "Publish release"

### Через Git

```bash
# Создать тег
git tag -a v1.0.0 -m "Release v1.0.0"

# Запушить тег
git push origin v1.0.0
```

---

## 🔐 Настройка SSH (рекомендуется)

### Генерация SSH ключа

```bash
# Сгенерировать ключ
ssh-keygen -t ed25519 -C "your_email@example.com"

# Запустить ssh-agent
eval "$(ssh-agent -s)"

# Добавить ключ
ssh-add ~/.ssh/id_ed25519
```

### Добавление ключа на GitHub

1. Скопировать публичный ключ:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Открыть GitHub → Settings → SSH and GPG keys
3. Нажать "New SSH key"
4. Вставить ключ и сохранить

### Изменить remote на SSH

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/e-budget-backend.git
```

---

## 📋 Полезные команды Git

```bash
# Статус
git status

# История коммитов
git log
git log --oneline

# Отменить изменения
git checkout -- file.txt

# Отменить последний коммит (но оставить изменения)
git reset --soft HEAD~1

# Посмотреть изменения
git diff

# Посмотреть ветки
git branch -a

# Удалить ветку
git branch -d feature/old-feature

# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/e-budget-backend.git
```

---

## 🚨 Важно!

### Не коммитить:

- ❌ `.env` файлы с секретами
- ❌ `node_modules/`
- ❌ Логи
- ❌ Бэкапы баз данных
- ❌ SSL сертификаты

Всё это уже в `.gitignore`!

### Проверить перед пушем:

```bash
# Проверить что в .gitignore
cat .gitignore

# Проверить что будет закоммичено
git status

# Проверить что .env не добавлен
git ls-files | grep .env
```

---

## 🔍 Проверка после публикации

### Чек-лист:

- [ ] Репозиторий создан на GitHub
- [ ] Все файлы запушены
- [ ] README.md отображается корректно
- [ ] .env файлы НЕ в репозитории
- [ ] LICENSE файл на месте
- [ ] Описание репозитория заполнено
- [ ] Topics добавлены
- [ ] Релиз создан (опционально)

---

## 📞 Помощь

Если возникли проблемы:

1. Проверить статус: `git status`
2. Проверить remote: `git remote -v`
3. Проверить логи: `git log`
4. Гуглить ошибку
5. Спросить в GitHub Discussions

---

## 🎓 Полезные ресурсы

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Готово! Ваш проект теперь на GitHub! 🎉**
