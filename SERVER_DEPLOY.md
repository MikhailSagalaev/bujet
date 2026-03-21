# 🚀 Развертывание на сервере

**Пошаговая инструкция для деплоя проекта на VPS**

---

## 📋 Что нужно

- VPS сервер (Ubuntu 20.04/22.04 или Debian)
- Минимум: 2GB RAM, 1 CPU, 20GB диск
- Доступ по SSH
- Домен (опционально, но рекомендуется)

---

## 🔧 Шаг 1: Подключиться к серверу

```bash
# Подключиться по SSH
ssh root@ваш-ip-адрес

# Или если у вас другой пользователь
ssh username@ваш-ip-адрес
```

---

## 📦 Шаг 2: Установить Docker и Docker Compose

```bash
# Обновить систему
apt update && apt upgrade -y

# Установить необходимые пакеты
apt install -y curl git

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose
apt install -y docker-compose

# Проверить установку
docker --version
docker-compose --version

# Добавить текущего пользователя в группу docker (если не root)
usermod -aG docker $USER
```

---

## 📥 Шаг 3: Скачать проект с GitHub

```bash
# Перейти в домашнюю директорию
cd ~

# Клонировать репозиторий
git clone https://github.com/MikhailSagalaev/bujet.git

# Перейти в папку проекта
cd bujet

# Проверить что файлы на месте
ls -la
```

Должны увидеть:
- `backend/`
- `widget/`
- `docker-compose.yml`
- `nginx.conf`
- И все документы

---

## ⚙️ Шаг 4: Настроить окружение

```bash
# Создать .env файл из примера
cp backend/.env.example backend/.env

# Открыть для редактирования
nano backend/.env
```

**Пока оставьте как есть**, токены добавим после запуска NocoDB.

Нажмите `Ctrl+X`, затем `Y`, затем `Enter` для сохранения.

---

## 🐳 Шаг 5: Запустить Docker Compose

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить что всё запустилось
docker-compose ps
```

Должны увидеть 4 сервиса:
- ✅ `ebudget_postgres` (running)
- ✅ `ebudget_nocodb` (running)
- ✅ `ebudget_api` (running)
- ✅ `ebudget_nginx` (running)

```bash
# Посмотреть логи (если нужно)
docker-compose logs -f
```

Нажмите `Ctrl+C` чтобы выйти из логов.

---

## 🗄️ Шаг 6: Настроить NocoDB

### 1. Открыть NocoDB в браузере

```
http://ваш-ip-адрес:8080
```

### 2. Создать аккаунт администратора

- Email: `admin@e-budget.ru` (или ваш email)
- Пароль: придумайте надёжный пароль
- Нажать "Sign Up"

### 3. Создать проект

- Нажать "+ New Project"
- Название: `E-Budget`
- Нажать "Create"

### 4. Импортировать данные

Вам нужно загрузить 3 CSV файла с вашего компьютера на сервер.

**На вашем компьютере (Windows):**

```powershell
# Открыть PowerShell в папке C:\projects\budjet

# Загрузить CSV файлы на сервер
scp "Users-Grid view.csv" root@ваш-ip:/root/bujet/
scp "Курсы-Grid view.csv" root@ваш-ip:/root/bujet/
scp "Покупки-Grid view.csv" root@ваш-ip:/root/bujet/
```

**На сервере в NocoDB:**

#### Таблица Users:
1. В NocoDB нажать "+ Add new table"
2. Выбрать "Import from CSV"
3. Нажать "Upload" и выбрать файл (нужно загрузить через веб-интерфейс)
4. Или использовать путь: `/root/bujet/Users-Grid view.csv`
5. Название таблицы: `Users`
6. Нажать "Import"

#### Таблица Курсы:
1. Повторить для `Курсы-Grid view.csv`
2. Название: `Курсы`

#### Таблица Покупки:
1. Повторить для `Покупки-Grid view.csv`
2. Название: `Покупки`

### 5. Настроить связи между таблицами

#### Users → Покупки:
1. Открыть таблицу `Покупки`
2. Найти колонку "Покупатель"
3. Изменить тип на "Link to another record"
4. Связать с таблицей `Users`

#### Покупки → Курсы:
1. Найти колонку "ID курса"
2. Связать с таблицей `Курсы`

### 6. Получить API токен

1. Нажать на аватар (правый верхний угол)
2. Settings → API Tokens
3. Нажать "+ Create Token"
4. Название: "Backend API"
5. **СКОПИРОВАТЬ ТОКЕН** (сохраните его!)

### 7. Получить Project ID

Посмотреть в URL браузера:
```
http://ваш-ip:8080/nc/p01234567890abcdef
                        ↑ это Project ID
```

**СКОПИРОВАТЬ Project ID**

---

## 🔑 Шаг 7: Обновить .env с токенами

**На сервере:**

```bash
# Открыть .env файл
nano backend/.env
```

Изменить:
```env
NOCODB_URL=http://nocodb:8080
NOCODB_TOKEN=ваш-токен-из-шага-6.6
NOCODB_PROJECT_ID=ваш-project-id-из-шага-6.7

PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=http://ваш-ip,https://ваш-домен.ru
PURCHASE_BONUS=300
REFERRAL_BONUS=100
```

Сохранить: `Ctrl+X`, `Y`, `Enter`

---

## 🔄 Шаг 8: Перезапустить API

```bash
# Перезапустить API сервис
docker-compose restart api

# Проверить логи
docker-compose logs -f api
```

Должны увидеть:
```
🚀 E-Budget Backend API
📡 Server running on port 3000
🌍 Environment: production
🗄️  NocoDB URL: http://nocodb:8080
```

Нажмите `Ctrl+C` чтобы выйти.

---

## ✅ Шаг 9: Проверить работу

### 1. Проверить health check

```bash
curl http://localhost:3000/health
```

Должно вернуть:
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T...",
  "environment": "production"
}
```

### 2. Проверить API endpoint

```bash
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"bazeeva@inbox.ru","offset":0,"limit":10}'
```

Должно вернуть список курсов (или ошибку если пользователя нет).

### 3. Проверить извне

На вашем компьютере откройте браузер:
```
http://ваш-ip-адрес:3000/health
```

Должно показать JSON с `"status": "ok"`.

---

## 🌐 Шаг 10: Настроить домен (опционально)

Если у вас есть домен, настройте DNS:

### 1. Добавить A-записи в DNS

В панели управления доменом добавьте:
```
A    @              ваш-ip-адрес
A    www            ваш-ip-адрес
A    api            ваш-ip-адрес
A    nocodb         ваш-ip-адрес
```

### 2. Подождать распространения DNS (5-30 минут)

Проверить:
```bash
ping ваш-домен.ru
```

---

## 🔒 Шаг 11: Настроить SSL (HTTPS)

```bash
# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Остановить Nginx в Docker (временно)
docker-compose stop nginx

# Получить сертификат
certbot certonly --standalone -d ваш-домен.ru -d www.ваш-домен.ru -d api.ваш-домен.ru

# Следовать инструкциям Certbot
# Ввести email
# Согласиться с условиями

# Сертификаты будут в:
# /etc/letsencrypt/live/ваш-домен.ru/fullchain.pem
# /etc/letsencrypt/live/ваш-домен.ru/privkey.pem
```

### Обновить nginx.conf

```bash
nano nginx.conf
```

Добавить SSL конфигурацию (см. DEPLOYMENT_CHECKLIST.md для полного примера).

### Обновить docker-compose.yml

```bash
nano docker-compose.yml
```

Добавить volume для SSL сертификатов:
```yaml
nginx:
  volumes:
    - ./widget:/usr/share/nginx/html/widget:ro
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # ← Добавить эту строку
```

### Перезапустить Nginx

```bash
docker-compose up -d nginx
```

### Проверить HTTPS

Открыть в браузере:
```
https://ваш-домен.ru
```

---

## 🎨 Шаг 12: Обновить URL в виджетах

**На вашем компьютере:**

Отредактировать файлы:
- `widget/js/widget-table.js`
- `widget/js/widget-cards.js`

Изменить:
```javascript
const CONFIG = {
  API_URL: 'https://api.ваш-домен.ru/api',  // ← Изменить
  // ...
};
```

Закоммитить и запушить:
```bash
git add widget/
git commit -m "Update API URL to production domain"
git push
```

**На сервере:**

```bash
# Обновить код
cd ~/bujet
git pull

# Перезапустить Nginx
docker-compose restart nginx
```

---

## 📤 Шаг 13: Загрузить виджеты на CDN или хостинг

Виджеты должны быть доступны по HTTPS для Tilda.

### Вариант 1: Использовать Nginx на сервере

Виджеты уже доступны по:
```
https://ваш-домен.ru/widget/js/widget-table.js
https://ваш-домен.ru/widget/js/widget-cards.js
https://ваш-домен.ru/widget/css/widget.css
```

### Вариант 2: Загрузить на отдельный хостинг

Можно загрузить папку `widget/` на любой хостинг с поддержкой статики.

---

## 🔗 Шаг 14: Подключить к Tilda

### 1. Добавить виджет на страницу Tilda

В редакторе Tilda добавить HTML-блок (T123):

```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Стили виджета -->
<link rel="stylesheet" href="https://ваш-домен.ru/widget/css/widget.css">

<!-- Виджет таблицы курсов -->
<script src="https://ваш-домен.ru/widget/js/widget-table.js"></script>

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

### 2. Настроить webhook в Tilda

1. Зайти в настройки формы оплаты
2. Webhooks → Добавить webhook
3. URL: `https://api.ваш-домен.ru/api/webhook/tilda`
4. События: "Успешная оплата"
5. Сохранить

---

## ✅ Шаг 15: Проверить всё работает

### Чек-лист:

- [ ] NocoDB открывается: `http://ваш-ip:8080`
- [ ] API health check работает: `http://ваш-ip:3000/health`
- [ ] Виджеты доступны: `https://ваш-домен.ru/widget/js/widget-table.js`
- [ ] Виджет отображается на Tilda
- [ ] Webhook от Tilda работает (сделать тестовую покупку)
- [ ] SSL сертификат установлен (зелёный замок в браузере)

---

## 🔄 Обновление проекта

Когда нужно обновить код:

```bash
# На сервере
cd ~/bujet

# Получить изменения
git pull

# Перезапустить сервисы
docker-compose restart

# Или пересобрать (если изменился Dockerfile)
docker-compose up -d --build
```

---

## 📊 Мониторинг

### Посмотреть логи:

```bash
# Все сервисы
docker-compose logs -f

# Только API
docker-compose logs -f api

# Только NocoDB
docker-compose logs -f nocodb
```

### Проверить статус:

```bash
docker-compose ps
```

### Проверить использование ресурсов:

```bash
docker stats
```

---

## 🛑 Остановка и удаление

### Остановить сервисы:

```bash
docker-compose stop
```

### Запустить снова:

```bash
docker-compose start
```

### Полностью удалить (с данными):

```bash
docker-compose down -v
```

⚠️ **ВНИМАНИЕ:** Это удалит все данные из базы!

---

## 🔐 Безопасность

### Рекомендации:

1. **Изменить пароли по умолчанию**
   - PostgreSQL (в docker-compose.yml)
   - NocoDB admin

2. **Настроить firewall**
   ```bash
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

3. **Закрыть порты NocoDB и API**
   В `docker-compose.yml` убрать:
   ```yaml
   ports:
     - "8080:8080"  # ← Удалить эту строку
     - "3000:3000"  # ← Удалить эту строку
   ```
   
   Доступ будет только через Nginx.

4. **Настроить автообновление SSL**
   ```bash
   certbot renew --dry-run
   ```

5. **Настроить резервное копирование**
   ```bash
   # Создать скрипт backup.sh
   nano /root/backup.sh
   ```
   
   Содержимое:
   ```bash
   #!/bin/bash
   docker exec ebudget_postgres pg_dump -U nocouser nocodb > /root/backups/nocodb_$(date +%Y%m%d).sql
   ```

---

## 📞 Помощь

Если что-то не работает:

1. Проверить логи: `docker-compose logs -f`
2. Проверить статус: `docker-compose ps`
3. Проверить .env: `cat backend/.env`
4. Перезапустить: `docker-compose restart`
5. Читать [FAQ.md](FAQ.md)

---

**Готово! Ваш проект развернут на сервере! 🎉**

Полный чек-лист деплоя: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
