# Анализ полей в таблицах NocoDB

## Таблица Users (Пользователи)

### Основные поля (хранятся в БД)

| Поле | Тип | Назначение | Откуда берётся |
|------|-----|------------|----------------|
| **ID** | Text | Уникальный идентификатор пользователя (rec...) | Автоматически при создании |
| **Имя** | Text | Имя пользователя | Из формы регистрации Tilda |
| **Email** | Email | Email пользователя (уникальный) | Из формы регистрации Tilda |
| **Тариф** | SingleSelect | Текущий тариф (🥈Базовый, 🥇Про и т.д.) | По умолчанию "🥈Базовый" |
| **Дата продления** | DateTime | Дата окончания подписки | При покупке подписки |
| **Количество рефералов** | Number | Сколько людей пригласил | Автоматически при регистрации по реферальной ссылке |
| **Оплатили подписку** | Number | Сколько рефералов оплатили | Автоматически при покупке рефералом |
| **Бонусы** | Number | Доступные бонусы для списания | Начисляются за покупки и рефералов |
| **Created** | DateTime | Дата создания записи | Автоматически |

### Связи (Links)

| Поле | Тип | Назначение | Как настроить |
|------|-----|------------|---------------|
| **Кто привёл** | Link to Users | Реферал (кто пригласил этого пользователя) | **НУЖНО НАСТРОИТЬ**: Link to `Users_Grid_view_csv`, Many to One, Self-reference |
| **Покупки** | Link to Purchases | Список покупок пользователя | Связь через поле "Покупатель" в таблице Покупки |
| **Курсы_link** | Link to Courses | Список курсов пользователя | Связь через покупки |

### Формульные поля (были в Airtable, сейчас текст)

| Поле | Тип в Airtable | Назначение | Решение |
|------|----------------|------------|---------|
| **html_psy** | Formula | HTML код для вставки имени на страницу | **Генерировать в API** |
| **Реферальная ссылка1** | Formula | Реферальная ссылка с utm_source=ID | **Генерировать в API** |
| **Tilda Статус подписки** | Formula | HTML код статуса подписки | **Генерировать в API** |
| **status_prof** | Formula | HTML код тарифа | **Генерировать в API** |
| **Code_block** | Formula | HTML код для localStorage | **Генерировать в API** |
| **Dashboard** | Formula | HTML код дашборда (курсы, рефералы, бонусы) | **Генерировать в API** |
| **HTML_ADD** | Formula | Комбинированный HTML код | **Генерировать в API** |
| **Списать бонусы** | Formula | HTML код кнопки списания бонусов | **Генерировать в API** |

### Устаревшие поля (можно удалить)

| Поле | Назначение | Почему не нужно |
|------|------------|-----------------|
| **Покупки друзей** | Список покупок рефералов | Можно получить через связь "Кто привёл" |
| **Покупки 2, Покупки 3** | Дубликаты поля Покупки | Не используются |
| **Email (from Кто привёл)** | Email реферала | Можно получить через связь |

---

## Таблица Курсы (Courses)

### Основные поля

| Поле | Тип | Назначение | Откуда берётся |
|------|-----|------------|----------------|
| **ID** | Text | Уникальный идентификатор курса (rec...) | Автоматически |
| **Название** | Text | Название курса | Вручную при создании курса |
| **Ссылка** | URL | Ссылка на страницу курса | Вручную |
| **date** | DateTime | Дата создания/публикации | Вручную |
| **Дата** | DateTime | Дата (дубликат?) | Вручную |
| **Created** | DateTime | Дата создания записи | Автоматически |

### Связи

| Поле | Тип | Назначение |
|------|-----|------------|
| **Users** | Link to Users | Пользователи, купившие курс |
| **Email (from Users)** | Lookup | Email пользователей (через связь Users) |

### Формульные поля

| Поле | Тип в Airtable | Назначение | Решение |
|------|----------------|------------|---------|
| **Tilda_Ссылка** | Formula | HTML кнопка "Перейти" | **Генерировать в API** |

---

## Таблица Покупки (Purchases)

### Основные поля

| Поле | Тип | Назначение | Откуда берётся |
|------|-----|------------|----------------|
| **ID** | Text | Уникальный идентификатор покупки (rec...) | Автоматически |
| **Email** | Email | Email покупателя | Из webhook Tilda |
| **order_id** | Text | ID заказа из Tilda | Из webhook Tilda |
| **Оплата** | SingleSelect | Статус оплаты ("Да"/"Нет") | Из webhook Tilda (payment) |
| **Бонусы списать** | Number | Сколько бонусов списано | Из webhook Tilda |
| **Бонусы начислить** | Number | Сколько бонусов начислено | Рассчитывается в API |
| **ID курса** | Text | ID купленного курса | Из webhook Tilda (course_id) |
| **Название курса** | Text | Название курса | Lookup из таблицы Курсы |
| **Date** | DateTime | Дата покупки | Из webhook Tilda |
| **Created** | DateTime | Дата создания записи | Автоматически |
| **Дата создания** | DateTime | Дата (дубликат?) | Автоматически |

### Связи

| Поле | Тип | Назначение | Как настроить |
|------|-----|------------|---------------|
| **Покупатель** | Link to Users | Пользователь, совершивший покупку | **НУЖНО НАСТРОИТЬ**: Link to `Users_Grid_view_csv`, Many to One |
| **Друг** | Link to Users | Реферал покупателя | Через связь Покупатель → Кто привёл |
| **Users, Users 2** | Link to Users | Дубликаты связи Покупатель | Можно удалить |

### Формульные поля

| Поле | Тип в Airtable | Назначение | Решение |
|------|----------------|------------|---------|
| **Calculation** | Formula | Имя покупателя | Lookup через связь Покупатель |
| **Email друга** | Formula | Email реферала | Lookup через связь Друг |

---

## Ответы на твои вопросы

### 1. Кто привёл — откуда берём и как прилинковывать?

**Откуда берём:**
- При регистрации пользователя через Tilda webhook приходит `utm_source` (это ID реферала)
- Сохраняем в поле "Кто привёл"

**Как прилинковать в NocoDB:**

1. Зайди в NocoDB → таблица Users
2. Найди поле "Кто привёл" (сейчас оно Text)
3. Измени тип поля на `Links to another record`:
   - Link to: `Users_Grid_view_csv` (та же таблица)
   - Relation type: `Many to One` (много пользователей → один реферал)
   - Display column: `Имя` или `Email`

**В коде:**
```javascript
// При создании пользователя в webhook
const newUserData = {
  Email: email,
  Имя: name,
  'Кто привёл': utm_source  // Это будет ID реферала (recXXXXX)
};
```

### 2. Поля-формулы — как сделать?

**Проблема:** В Airtable были формулы типа:
```
CONCATENATE("<script>$('.example-1 .tn-atom').text('", ReferralLink, "');</script>")
```

**Решение: Генерировать HTML в API (Вариант B — правильный)**

Вместо хранения HTML в базе, генерируем его на лету в API:

```javascript
// backend/utils/helpers.js

// Генерация реферальной ссылки
function generateReferralLink(userId) {
  return `https://e-budget.ru/members/signup?utm_source=${userId}&utm_medium=referral&utm_campaign=friends`;
}

// Генерация HTML кода для вставки имени
function generateNameHTML(name) {
  return `<script>$(".fio .tn-atom").html("${name || ''}");</script>`;
}

// Генерация HTML кода реферальной ссылки
function generateReferralHTML(userId) {
  const link = generateReferralLink(userId);
  return `<script>$('.example-1 .tn-atom').text('${link}');</script>`;
}

// Генерация HTML кода тарифа
function generateTariffHTML(tariff) {
  return `<script>$(".tarif .tn-atom").html("</br></span><b>Текущий тариф:</b> ${tariff}<br><a href='https://e-budget.ru/pro'>Улучшить тариф ➤</a></br>");</script>`;
}

// Генерация HTML дашборда
function generateDashboardHTML(coursesCount, referralsCount, bonuses) {
  return `<script>
$(".tn-elem__5435214961675016424996 .tn-atom").text(${coursesCount});
$(".tn-elem__5435214961675016455904 .tn-atom").text(${referralsCount});
$(".tn-elem__5435214961676984464176 .tn-atom").text(${bonuses}+" б.");
</script>`;
}

// Генерация HTML кнопки списания бонусов
function generateBonusButtonHTML(bonuses) {
  return `<script>
function applyBonus() {
  $(".t-btn__bonus").remove();
  promo={promocode: "BONUS", discountsum: Math.min(window.tcart.amount - 1,${bonuses})};
  t_input_promocode__addPromocode (promo);
} 
$('<div onclick="applyBonus();" class="t-btn t-btn__bonus" style="width: 100%;">Списать бонусы (доступно ${bonuses})</div>').insertBefore(".t706 .t-form__submit");
</script>`;
}
```

**Использование в API:**
```javascript
// backend/routes/widget.js
router.post('/profile', async (req, res) => {
  const user = await nocodbService.getUserByEmail(email);
  const referralsData = await nocodbService.getUserReferrals(user.ID);
  
  const html = {
    name: helpers.generateNameHTML(user.Имя),
    referralLink: helpers.generateReferralHTML(user.ID),
    tariff: helpers.generateTariffHTML(user.Тариф),
    dashboard: helpers.generateDashboardHTML(
      user.coursesCount,
      referralsData.count,
      user.Бонусы
    ),
    bonusButton: helpers.generateBonusButtonHTML(user.Бонусы)
  };
  
  res.json({ html });
});
```

---

## Что нужно сделать

### 1. Настроить связи в NocoDB

- [ ] Поле "Кто привёл" в Users → Link to Users (Many to One)
- [ ] Поле "Покупатель" в Purchases → Link to Users (Many to One)

### 2. Обновить код API

- [ ] Добавить функции генерации HTML в `helpers.js`
- [ ] Обновить роуты виджетов для возврата сгенерированного HTML
- [ ] Обновить webhook для сохранения `utm_source` в поле "Кто привёл"

### 3. Удалить ненужные поля (опционально)

- [ ] Покупки 2, Покупки 3 в Users
- [ ] Users, Users 2 в Purchases
- [ ] Email (from Кто привёл) в Users
- [ ] Calculation, Email друга в Purchases

### 4. Заменить Make сценарии

Make использовался для автоматизации:
- Начисления бонусов при покупке
- Обновления счётчиков рефералов
- Отправки email уведомлений

**Решение:** Всё это делаем в webhook API (уже реализовано в `backend/routes/webhook.js`)
