const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { email, segment, institution, role, docs, processes, control, focus } = req.body;

    // Валидация
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    // Определяем статус готовности
    const statusMap = {
      '1': 'Начальный уровень',
      '2': 'Средний уровень',
      '3': 'Высокий уровень'
    };
    const status = statusMap[segment] || 'Не определён';

    // Определяем слабый контур
    let weakPoint = 'документы';
    if (docs === 'no') weakPoint = 'документы';
    else if (processes === 'no') weakPoint = 'процессы';
    else if (control === 'no') weakPoint = 'контроль';

    // Текстовая версия письма
    const textContent = `
Матрица готовности к 2026 году
Результаты диагностики учреждения

СТАТУС ГОТОВНОСТИ: ${status}

Тип учреждения: ${institution}
Ваша роль: ${role}

СЛАБЫЙ КОНТУР: ${weakPoint}
Это зона, которая требует первоочередного внимания для успешного перехода на новые стандарты.

ВАШИ ОТВЕТЫ:
- Учётная политика: ${docs === 'done' ? 'Обновлена' : docs === 'partial' ? 'Частично обновлена' : 'Не обновлена'}
- Процессы ФСБУ: ${processes === 'done' ? 'Выстроены' : processes === 'partial' ? 'Частично выстроены' : 'Фрагментарны'}
- Внутренний контроль: ${control === 'done' ? 'Рабочий' : control === 'partial' ? 'Частичный' : 'Слабый'}
- Приоритет: ${focus === 'start' ? 'Понять первый шаг' : focus === 'docs' ? 'Проверить документы' : focus === 'mgmt' ? 'Подготовить позицию' : 'Точечная доработка'}

ПЕРВЫЙ ШАГ:
${segment === '1' ? 'Начните с аудита учётной политики и локальных актов. Это фундамент для дальнейшей работы.' : segment === '2' ? 'Доработайте процессы и усильте контроль в слабых зонах.' : 'Проведите финальную проверку и точечную корректировку формулировок.'}

Перейти к детальному самоаудиту: https://e-budget.ru/audit-2026.html

---
e-budget.ru — Практические инструменты для бюджетного учёта
Данные обрабатываются в соответствии с 152-ФЗ
    `.trim();

    // HTML версия письма
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Матрица готовности к 2026 году</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
      line-height: 1.6; 
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      background-color: #00C9A7;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content { 
      padding: 30px 20px;
    }
    .status { 
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #00C9A7;
    }
    .status h2 {
      margin: 0 0 15px 0;
      font-size: 20px;
      color: #1a1f2e;
    }
    .status p {
      margin: 8px 0;
      color: #495057;
    }
    .weak { 
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .weak h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #856404;
    }
    .weak p {
      margin: 0;
      color: #856404;
    }
    .section {
      margin: 25px 0;
    }
    .section h3 {
      font-size: 18px;
      color: #1a1f2e;
      margin: 0 0 15px 0;
    }
    .section ul {
      margin: 0;
      padding-left: 20px;
    }
    .section li {
      margin: 8px 0;
      color: #495057;
    }
    .action-button { 
      display: inline-block;
      background-color: #00C9A7;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
      text-align: center;
    }
    .footer { 
      text-align: center;
      color: #6c757d;
      font-size: 13px;
      padding: 20px;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Матрица готовности к 2026 году</h1>
      <p>Результаты диагностики учреждения</p>
    </div>
    
    <div class="content">
      <div class="status">
        <h2>Статус готовности: ${status}</h2>
        <p><strong>Тип учреждения:</strong> ${institution}</p>
        <p><strong>Ваша роль:</strong> ${role}</p>
      </div>

      <div class="weak">
        <h3>Слабый контур: ${weakPoint}</h3>
        <p>Это зона, которая требует первоочередного внимания для успешного перехода на новые стандарты.</p>
      </div>

      <div class="section">
        <h3>Ваши ответы:</h3>
        <ul>
          <li><strong>Учётная политика:</strong> ${docs === 'done' ? 'Обновлена' : docs === 'partial' ? 'Частично обновлена' : 'Не обновлена'}</li>
          <li><strong>Процессы ФСБУ:</strong> ${processes === 'done' ? 'Выстроены' : processes === 'partial' ? 'Частично выстроены' : 'Фрагментарны'}</li>
          <li><strong>Внутренний контроль:</strong> ${control === 'done' ? 'Рабочий' : control === 'partial' ? 'Частичный' : 'Слабый'}</li>
          <li><strong>Приоритет:</strong> ${focus === 'start' ? 'Понять первый шаг' : focus === 'docs' ? 'Проверить документы' : focus === 'mgmt' ? 'Подготовить позицию' : 'Точечная доработка'}</li>
        </ul>
      </div>

      <div class="section">
        <h3>Первый шаг:</h3>
        <p>${segment === '1' ? 'Начните с аудита учётной политики и локальных актов. Это фундамент для дальнейшей работы.' : segment === '2' ? 'Доработайте процессы и усильте контроль в слабых зонах.' : 'Проведите финальную проверку и точечную корректировку формулировок.'}</p>
      </div>

      <center>
        <a href="https://e-budget.ru/audit-2026.html" class="action-button">Перейти к детальному самоаудиту</a>
      </center>
    </div>

    <div class="footer">
      <p><strong>e-budget.ru</strong> — Практические инструменты для бюджетного учёта</p>
      <p>Данные обрабатываются в соответствии с 152-ФЗ</p>
    </div>
  </div>
</body>
</html>
    `;

    // Отправка через Resend SDK
    const resendApiKey = process.env.RESEND_API_KEY || 're_UifK8xz8_NERb7x5PmAiGJa5GkDvs2UUM';
    const resend = new Resend(resendApiKey);
    
    const { data, error } = await resend.emails.send({
      from: 'E-Budget <noreply@e-budget.ru>',
      to: email,
      subject: `Матрица готовности к 2026 году — ${status}`,
      text: textContent,
      html: htmlContent
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Ошибка отправки email' });
    }

    console.log('Email sent:', data);

    res.json({ success: true, message: 'Email отправлен' });

  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
