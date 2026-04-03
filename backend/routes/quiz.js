const express = require('express');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { email, segment } = req.body;

    // Валидация
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    // Определяем статус готовности и файл шаблона
    const segmentMap = {
      '1': { status: 'Стартовая зона', file: 'email-v2-segment-1-startovaya.html' },
      '2': { status: 'Частичная готовность', file: 'email-v2-segment-2-chastichnaya.html' },
      '3': { status: 'Рабочая база', file: 'email-v2-segment-3-rabochaya-baza.html' }
    };
    
    const segmentData = segmentMap[segment] || segmentMap['1'];
    const status = segmentData.status;

    // Читаем HTML шаблон из файла (файлы в корне проекта)
    const templatePath = path.join(__dirname, '..', '..', segmentData.file);
    
    if (!fs.existsSync(templatePath)) {
      console.error('Template file not found:', templatePath);
      return res.status(500).json({ error: 'Шаблон письма не найден' });
    }
    
    const htmlContent = fs.readFileSync(templatePath, 'utf8');

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
