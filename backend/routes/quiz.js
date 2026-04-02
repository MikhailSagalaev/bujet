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

    // Формируем HTML письма (табличная вёрстка для Outlook)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;">
    <tr>
      <td align="center" style="padding:20px 0;">
        
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#00C9A7,#0ea5e9);background-color:#00C9A7;padding:30px;text-align:center;border-radius:12px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Матрица готовности к 2026 году</h1>
              <p style="margin:10px 0 0 0;color:#ffffff;font-size:16px;">Результаты диагностики учреждения</p>
            </td>
          </tr>
          
          <!-- Spacer -->
          <tr><td style="height:20px;"></td></tr>
          
          <!-- Content -->
          <tr>
            <td style="background-color:#ffffff;padding:30px;border-radius:12px;">
              
              <!-- Status -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-left:4px solid #00C9A7;padding:20px;margin-bottom:20px;">
                <tr>
                  <td>
                    <h2 style="margin:0 0 15px 0;color:#1a1f2e;font-size:20px;font-weight:700;">📊 Статус готовности: ${status}</h2>
                    <p style="margin:5px 0;color:#1a1f2e;font-size:15px;"><strong>Тип учреждения:</strong> ${institution}</p>
                    <p style="margin:5px 0;color:#1a1f2e;font-size:15px;"><strong>Ваша роль:</strong> ${role}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Weak Point -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff3cd;padding:15px;margin-bottom:20px;border-radius:8px;">
                <tr>
                  <td>
                    <h3 style="margin:0 0 10px 0;color:#1a1f2e;font-size:18px;font-weight:700;">⚠️ Слабый контур: ${weakPoint}</h3>
                    <p style="margin:0;color:#1a1f2e;font-size:14px;line-height:1.6;">Это зона, которая требует первоочередного внимания для успешного перехода на новые стандарты.</p>
                  </td>
                </tr>
              </table>
              
              <!-- Answers -->
              <h3 style="margin:20px 0 10px 0;color:#1a1f2e;font-size:18px;font-weight:700;">Ваши ответы:</h3>
              <ul style="margin:0;padding-left:20px;color:#1a1f2e;font-size:14px;line-height:1.8;">
                <li><strong>Учётная политика:</strong> ${docs === 'done' ? 'Обновлена' : docs === 'partial' ? 'Частично обновлена' : 'Не обновлена'}</li>
                <li><strong>Процессы ФСБУ:</strong> ${processes === 'done' ? 'Выстроены' : processes === 'partial' ? 'Частично выстроены' : 'Фрагментарны'}</li>
                <li><strong>Внутренний контроль:</strong> ${control === 'done' ? 'Рабочий' : control === 'partial' ? 'Частичный' : 'Слабый'}</li>
                <li><strong>Приоритет:</strong> ${focus === 'start' ? 'Понять первый шаг' : focus === 'docs' ? 'Проверить документы' : focus === 'mgmt' ? 'Подготовить позицию' : 'Точечная доработка'}</li>
              </ul>
              
              <!-- First Step -->
              <h3 style="margin:20px 0 10px 0;color:#1a1f2e;font-size:18px;font-weight:700;">🎯 Первый шаг:</h3>
              <p style="margin:0 0 20px 0;color:#1a1f2e;font-size:14px;line-height:1.6;">${segment === '1' ? 'Начните с аудита учётной политики и локальных актов. Это фундамент для дальнейшей работы.' : segment === '2' ? 'Доработайте процессы и усильте контроль в слабых зонах.' : 'Проведите финальную проверку и точечную корректировку формулировок.'}</p>
              
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#00C9A7;border-radius:8px;text-align:center;">
                    <a href="https://e-budget.ru/audit-2026.html" style="display:inline-block;padding:15px 30px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Перейти к детальному самоаудиту →</a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Spacer -->
          <tr><td style="height:20px;"></td></tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:20px;color:#64748b;font-size:14px;">
              <p style="margin:5px 0;">e-budget.ru — Практические инструменты для бюджетного учёта</p>
              <p style="margin:5px 0;">Данные обрабатываются в соответствии с 152-ФЗ</p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
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
