# ⚡ Быстрое развертывание на сервере

**Все команды в одном месте**

---

## 🚀 Полная установка (копируй и вставляй)

### На сервере (Ubuntu/Debian):

```bash
# 1. Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# 2. Установить Docker Compose
apt install -y docker-compose git

# 3. Скачать проект
cd ~ && git clone https://github.com/MikhailSagalaev/bujet.git && cd bujet

# 4. Создать .env
cp backend/.env.example backend/.env

# 5. Запустить
docker-compose up -d

# 6. Проверить
docker-compose ps
```

---

## 🗄️ Настройка NocoDB

1. Открыть: `http://ваш-ip:8080`
2. Создать аккаунт
3. Создать проект "E-Budget"
4. Импортировать 3 CSV файла
5. Получить API токен (Settings → API Tokens)
6. Скопировать Project ID из URL

---

## 🔑 Обновить токены

```bash
# Открыть .env
nano backend/.env
```

Изменить:
```env
NOCODB_TOKEN=ваш-токен
NOCODB_PROJECT_ID=ваш-project-id
ALLOWED_ORIGINS=http://ваш-ip,https://ваш-домен.ru
```

Сохранить: `Ctrl+X`, `Y`, `Enter`

```bash
# Перезапустить API
docker-compose restart api
```

---

## ✅ Проверка

```bash
# Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/widget/courses \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@example.com","offset":0,"limit":10}'
```

---

## 📤 Загрузить CSV файлы на сервер

**На вашем компьютере (Windows PowerShell):**

```powershell
# Перейти в папку проекта
cd C:\projects\budjet

# Загрузить файлы
scp "Users-Grid view.csv" root@ваш-ip:/root/bujet/
scp "Курсы-Grid view.csv" root@ваш-ip:/root/bujet/
scp "Покупки-Grid view.csv" root@ваш-ip:/root/bujet/
```

---

## 🔒 SSL (HTTPS)

```bash
# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Остановить Nginx
docker-compose stop nginx

# Получить сертификат
certbot certonly --standalone -d ваш-домен.ru -d www.ваш-домен.ru

# Обновить docker-compose.yml
nano docker-compose.yml
```

Добавить в секцию nginx:
```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

```bash
# Запустить Nginx
docker-compose up -d nginx
```

---

## 🔄 Полезные команды

```bash
# Посмотреть логи
docker-compose logs -f

# Посмотреть логи API
docker-compose logs -f api

# Проверить статус
docker-compose ps

# Перезапустить всё
docker-compose restart

# Остановить
docker-compose stop

# Запустить
docker-compose start

# Обновить код
git pull && docker-compose restart

# Пересобрать
docker-compose up -d --build
```

---

## 🎨 Подключить к Tilda

### 1. HTML-блок на странице:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://ваш-домен.ru/widget/css/widget.css">
<script src="https://ваш-домен.ru/widget/js/widget-table.js"></script>

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

### 2. Webhook в Tilda:

URL: `https://api.ваш-домен.ru/api/webhook/tilda`

---

## 🔐 Безопасность

```bash
# Настроить firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Автообновление SSL
certbot renew --dry-run
```

---

## 📊 Мониторинг

```bash
# Использование ресурсов
docker stats

# Место на диске
df -h

# Логи в реальном времени
docker-compose logs -f
```

---

## 🆘 Если что-то сломалось

```bash
# 1. Посмотреть логи
docker-compose logs -f

# 2. Проверить статус
docker-compose ps

# 3. Перезапустить
docker-compose restart

# 4. Полный перезапуск
docker-compose down && docker-compose up -d

# 5. Проверить .env
cat backend/.env
```

---

## 📞 Ссылки

- Полная инструкция: [SERVER_DEPLOY.md](SERVER_DEPLOY.md)
- Чек-лист деплоя: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- FAQ: [FAQ.md](FAQ.md)

---

**Готово! Проект развернут! 🎉**
