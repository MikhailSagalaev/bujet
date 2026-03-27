# Пошаговая настройка NocoDB

## Шаг 1: Удали старые таблицы

1. Зайди в NocoDB
2. Удали таблицы `Users_Grid_view_csv`, `Курсы_Grid_view_csv`, `Покупки_Grid_view_csv`

## Шаг 2: Импортируй новые CSV

1. Импортируй `Users-Clean.csv` → название таблицы: `Users`
2. Импортируй `Курсы-Clean.csv` → название таблицы: `Courses`
3. Импортируй `Покупки-Clean.csv` → название таблицы: `Purchases`

## Шаг 3: Настрой типы полей в таблице Users

### 3.1 Базовые поля (проверь типы)

| Поле | Тип | Действие |
|------|-----|----------|
| ID | Formula | **Создать новое поле** (см. ниже) |
| Имя | SingleLineText | Оставить как есть |
| Email | Email | Изменить на Email если не так |
| Тариф | SingleSelect | Изменить на SingleSelect, опции: `🥈Базовый`, `🥇Про` |
| Дата продления | DateTime | Оставить как есть |
| Количество рефералов | Number | Оставить как есть |
| Оплатили подписку | Number | Оставить как есть |
| Бонусы | Number | Оставить как есть |
| Created | DateTime | Оставить как есть |
| Кто привёл | SingleLineText | **Изменить на LinkToAnotherRecord** (см. ниже) |

### 3.2 Настрой связь "Кто привёл"

1. Найди поле `Кто привёл`
2. Edit Column → Change Type → `LinkToAnotherRecord`
3. Настройки:
   - **Link to table:** Users (та же таблица)
   - **Relation type:** Many to One
   - **Display column:** Email или Имя
4. Save

### 3.3 Создай формульные поля

Создай новые столбцы с типом Formula:

#### ID
```
CONCAT("rec", {Id})
```
**Примечание:** Генерирует уникальный ID в формате `rec1`, `rec2` и т.д. на основе системного поля `Id`

#### html_psy
```
CONCAT("<script>$(\".fio .tn-atom\").html(\"", IF({Имя}, {Имя}, ""), "\");</script>")
```

#### Реферальная ссылка1
```
CONCAT("<script>$('.example-1 .tn-atom').text('https://e-budget.ru/members/signup?utm_source=", {ID}, "&utm_medium=referral&utm_campaign=friends>');</script>")
```

#### Tilda Статус подписки
```
CONCAT("</br></span><b>Текущий тариф:</b> ", IF({Тариф}, {Тариф}, "🥈Базовый"), "<br><a href='https://e-budget.ru/pro'>Улучшить тариф ➤</a></br>")
```

#### status_prof
```
CONCAT("$(\".tarif .tn-atom\").html(\"", {Tilda Статус подписки}, "\");")
```

#### Code_block
```
IF({Тариф} = "🥇Про", "<script>localStorage.setItem(\"pro\", 1);$(\".saleicon\").show();</script>", "<script>localStorage.setItem(\"pro\", 0);$(\".saleicon\").hide();</script>")
```

#### Dashboard
```
CONCAT("<script>$(\".tn-elem__5435214961675016424996 .tn-atom\").text(", IF({Количество рефералов}, {Количество рефералов}, 0), ");$(\".tn-elem__5435214961675016455904 .tn-atom\").text(", IF({Оплатили подписку}, {Оплатили подписку}, 0), ");$(\".tn-elem__5435214961676984464176 .tn-atom\").text(", IF({Бонусы}, {Бонусы}, 0), "+\" б.\");</script>")
```

#### Списать бонусы
```
CONCAT("<script>function applyBonus(){$(\".t-btn__bonus\").remove();promo={promocode:\"BONUS\",discountsum:Math.min(window.tcart.amount-1,", IF({Бонусы}, {Бонусы}, 0), ")};t_input_promocode__addPromocode(promo);}$('<div onclick=\"applyBonus();\" class=\"t-btn t-btn__bonus\" style=\"width:100%;\">Списать бонусы (доступно ", IF({Бонусы}, {Бонусы}, 0), ")</div>').insertBefore(\".t706 .t-form__submit\");</script>")
```

#### HTML_ADD
```
CONCAT({Dashboard}, {Реферальная ссылка1}, {Списать бонусы}, {Code_block})
```

---

## Шаг 4: Настрой таблицу Courses

### 4.1 Базовые поля

| Поле | Тип | Действие |
|------|-----|----------|
| ID | SingleLineText | Оставить |
| Название | SingleLineText | Оставить |
| Ссылка | URL | Изменить на URL |
| date | DateTime | Оставить |
| Created | DateTime | Оставить |

### 4.2 Создай формульное поле

#### Tilda_Ссылка
```
CONCAT("Перейти button=", {Ссылка})
```

---

## Шаг 5: Настрой таблицу Purchases

### 5.1 Базовые поля

| Поле | Тип | Действие |
|------|-----|----------|
| ID | SingleLineText | Оставить |
| Email | Email | Изменить на Email |
| order_id | SingleLineText | Оставить |
| Оплата | SingleSelect | Изменить на SingleSelect, опции: `Да`, `Нет` |
| Покупатель | SingleLineText | **Изменить на LinkToAnotherRecord** (см. ниже) |
| Бонусы списать | Number | Оставить |
| Бонусы начислить | Number | Оставить |
| ID курса | SingleLineText | **Изменить на LinkToAnotherRecord** (см. ниже) |
| Название курса | SingleLineText | Оставить (или сделать Lookup) |
| Date | DateTime | Оставить |
| Created | DateTime | Оставить |

### 5.2 Настрой связь "Покупатель"

1. Найди поле `Покупатель`
2. Edit Column → Change Type → `LinkToAnotherRecord`
3. Настройки:
   - **Link to table:** Users
   - **Relation type:** Many to One
   - **Display column:** Email
4. Save

### 5.3 Настрой связь "ID курса"

1. Найди поле `ID курса`
2. Edit Column → Change Type → `LinkToAnotherRecord`
3. Настройки:
   - **Link to table:** Courses
   - **Relation type:** Many to One
   - **Display column:** Название
4. Save

### 5.4 Измени "Название курса" на Lookup (опционально)

1. Найди поле `Название курса`
2. Edit Column → Change Type → `Lookup`
3. Настройки:
   - **Lookup from:** ID курса
   - **Lookup field:** Название
4. Save

---

## Шаг 6: Обнови config.js с новыми ID таблиц

После импорта получи новые ID таблиц:

```bash
# На сервере
curl -X GET "http://localhost:8080/api/v2/meta/bases/p0o848dnq1jfzu0/tables" \
  -H "xc-token: wOYmcdqxhT91pYQ1OhIQXQXGkyIAjkMTVXsBlUzs"
```

Обнови `backend/config.js`:
```javascript
tables: {
  users: 'НОВЫЙ_ID_USERS',
  courses: 'НОВЫЙ_ID_COURSES',
  purchases: 'НОВЫЙ_ID_PURCHASES'
}
```

---

## Шаг 7: Обнови API для работы с "Дата продления"

В `backend/routes/webhook.js` добавь логику обновления даты продления при покупке подписки:

```javascript
// При покупке подписки
if (order_id && payment === 'Да' && course_id === 'SUBSCRIPTION_COURSE_ID') {
  const currentDate = user['Дата продления'] ? new Date(user['Дата продления']) : new Date();
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1); // +1 месяц
  
  await nocodbService.updateUser(user.ID, {
    'Дата продления': newDate.toISOString()
  });
}
```

---

## Проверка

После настройки проверь:
1. Формулы работают (открой любую запись в Users)
2. Связи работают (кликни на "Кто привёл" — должен показать список пользователей)
3. API работает (проверь `/api/widget/courses`)

---

## Если формулы не работают

Если какие-то формулы выдают ошибку:
1. Проверь, что все зависимые поля созданы
2. Упрости формулу (убери часть кода)
3. Напиши мне — я помогу исправить
