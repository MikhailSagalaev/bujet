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

    // Формируем HTML письма
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1f2e; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(90deg, #00C9A7, #0ea5e9); padding: 30px; border-radius: 12px; color: white; text-align: center; }
    .content { background: #f7f7f7; padding: 30px; margin-top: 20px; border-radius: 12px; }
    .status { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00C9A7; }
    .weak { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .action { background: #00C9A7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; }
    .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
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
        <h2>📊 Статус готовности: ${status}</h2>
        <p><strong>Тип учреждения:</strong> ${institution}</p>
        <p><strong>Ваша роль:</strong> ${role}</p>
      </div>

      <div class="weak">
        <h3>⚠️ Слабый контур: ${weakPoint}</h3>
        <p>Это зона, которая требует первоочередного внимания для успешного перехода на новые стандарты.</p>
      </div>

      <h3>Ваши ответы:</h3>
      <ul>
        <li><strong>Учётная политика:</strong> ${docs === 'done' ? 'Обновлена' : docs === 'partial' ? 'Частично обновлена' : 'Не обновлена'}</li>
        <li><strong>Процессы ФСБУ:</strong> ${processes === 'done' ? 'Выстроены' : processes === 'partial' ? 'Частично выстроены' : 'Фрагментарны'}</li>
        <li><strong>Внутренний контроль:</strong> ${control === 'done' ? 'Рабочий' : control === 'partial' ? 'Частичный' : 'Слабый'}</li>
        <li><strong>Приоритет:</strong> ${focus === 'start' ? 'Понять первый шаг' : focus === 'docs' ? 'Проверить документы' : focus === 'mgmt' ? 'Подготовить позицию' : 'Точечная доработка'}</li>
      </ul>

      <h3>🎯 Первый шаг:</h3>
      <p>${segment === '1' ? 'Начните с аудита учётной политики и локальных актов. Это фундамент для дальнейшей работы.' : segment === '2' ? 'Доработайте процессы и усильте контроль в слабых зонах.' : 'Проведите финальную проверку и точечную корректировку формулировок.'}</p>

      <a href="https://e-budget.ru/audit-2026.html" class="action">Перейти к детальному самоаудиту →</a>
    </div>

    <div class="footer">
      <p>e-budget.ru — Практические инструменты для бюджетного учёта</p>
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
