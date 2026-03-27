# Формулы для таблицы Users

## Список всех столбцов и их формулы

### 1. ID
**Тип:** SingleLineText (автоматический)
**Формула:** Нет

### 2. Имя
**Тип:** SingleLineText
**Формула:** Нет

### 3. Email
**Тип:** Email
**Формула:** Нет

### 4. html_psy
**Тип:** Formula
**Формула:**
```
CONCAT("<script>$(\".fio .tn-atom\").html(\"", IF({Имя}, {Имя}, ""), "\");</script>")
```

### 5. Кто привёл
**Тип:** LinkToAnotherRecord (Link to Users, Many to One)
**Формула:** Нет (это связь)

### 6. Email (from Кто привёл)
**Тип:** Lookup
**Настройка:**
- Lookup from: Кто привёл
- Lookup field: Email
**Формула:** Нет (это Lookup)

### 7. Реферальная ссылка1
**Тип:** Formula
**Формула:**
```
CONCAT("<script>$('.example-1 .tn-atom').text('https://e-budget.ru/members/signup?utm_source=", {ID}, "&utm_medium=referral&utm_campaign=friends>');</script>")
```

### 8. Тариф
**Тип:** SingleSelect
**Опции:** 🥈Базовый, 🥇Про
**Формула:** Нет

### 9. Дата продления
**Тип:** DateTime
**Формула:** Нет

### 10. Покупки
**Тип:** LinkToAnotherRecord (Link to Purchases)
**Формула:** Нет (это связь)

### 11. Покупки друзей
**Тип:** Rollup
**Настройка:**
- Rollup from: Кто привёл (обратная связь)
- Rollup field: Покупки
- Rollup function: COUNT
**Формула:** Нет (это Rollup)

### 12. Tilda Статус подписки
**Тип:** Formula
**Формула:**
```
CONCAT("</br></span><b>Текущий тариф:</b> ", IF({Тариф}, {Тариф}, "🥈Базовый"), "<br><a href='https://e-budget.ru/pro'>Улучшить тариф ➤</a></br>")
```

### 13. status_prof
**Тип:** Formula
**Формула:**
```
CONCAT("$(\".tarif .tn-atom\").html(\"", {Tilda Статус подписки}, "\");")
```

### 14. Курсы_link
**Тип:** Lookup
**Настройка:**
- Lookup from: Покупки
- Lookup field: Название курса
**Формула:** Нет (это Lookup)

### 15. Покупки 2
**Тип:** LinkToAnotherRecord (дубликат, можно удалить)
**Формула:** Нет

### 16. Покупки 3
**Тип:** LinkToAnotherRecord (дубликат, можно удалить)
**Формула:** Нет

### 17. Code_block
**Тип:** Formula
**Формула:**
```
IF({Тариф} = "🥇Про", "<script>localStorage.setItem(\"pro\", 1);$(\".saleicon\").show();</script>", "<script>localStorage.setItem(\"pro\", 0);$(\".saleicon\").hide();</script>")
```

### 18. Dashboard
**Тип:** Formula
**Формула:**
```
CONCAT("<script>$(\".tn-elem__5435214961675016424996 .tn-atom\").text(", IF({Количество рефералов}, {Количество рефералов}, 0), ");$(\".tn-elem__5435214961675016455904 .tn-atom\").text(", IF({Оплатили подписку}, {Оплатили подписку}, 0), ");$(\".tn-elem__5435214961676984464176 .tn-atom\").text(", IF({Бонусы}, {Бонусы}, 0), "+\" б.\");</script>")
```

### 19. HTML_ADD
**Тип:** Formula
**Формула:**
```
CONCAT({Dashboard}, {Реферальная ссылка1}, {Списать бонусы}, {Code_block})
```

### 20. Количество рефералов
**Тип:** Number
**Формула:** Нет (обновляется через API)

### 21. Оплатили подписку
**Тип:** Number
**Формула:** Нет (обновляется через API)

### 22. Бонусы
**Тип:** Number
**Формула:** Нет (обновляется через API)

### 23. Created
**Тип:** DateTime (автоматический)
**Формула:** Нет

### 24. Списать бонусы
**Тип:** Formula
**Формула:**
```
CONCAT("<script>function applyBonus(){$(\".t-btn__bonus\").remove();promo={promocode:\"BONUS\",discountsum:Math.min(window.tcart.amount-1,", IF({Бонусы}, {Бонусы}, 0), ")};t_input_promocode__addPromocode(promo);}$('<div onclick=\"applyBonus();\" class=\"t-btn t-btn__bonus\" style=\"width:100%;\">Списать бонусы (доступно ", IF({Бонусы}, {Бонусы}, 0), ")</div>').insertBefore(\".t706 .t-form__submit\");</script>")
```

---

## Порядок создания формул

Создавай формулы в таком порядке (некоторые зависят от других):

1. **html_psy** (зависит от: Имя)
2. **Реферальная ссылка1** (зависит от: ID)
3. **Tilda Статус подписки** (зависит от: Тариф)
4. **status_prof** (зависит от: Tilda Статус подписки)
5. **Code_block** (зависит от: Тариф)
6. **Dashboard** (зависит от: Количество рефералов, Оплатили подписку, Бонусы)
7. **Списать бонусы** (зависит от: Бонусы)
8. **HTML_ADD** (зависит от: Dashboard, Реферальная ссылка1, Списать бонусы, Code_block)

---

## Как применить

Для каждого формульного поля:
1. Открой таблицу Users в NocoDB
2. Найди столбец или создай новый
3. Edit Column → Column Type: Formula
4. Скопируй формулу из списка выше
5. Save
