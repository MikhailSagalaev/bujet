const express = require('express');
const router = express.Router();
const nocodbService = require('../services/nocodb');
const helpers = require('../utils/helpers');
const config = require('../config');

/**
 * POST /api/webhook/tilda
 * Обработка webhooks от Тільды (покупки, регистрации)
 */
router.post('/tilda', async (req, res) => {
  try {
    console.log('='.repeat(50));
    console.log('TILDA WEBHOOK RECEIVED:');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('='.repeat(50));

    const {
      Email,
      Name,
      course_id,
      utm_source,
      payment: paymentData
    } = req.body;

    // Если нет Email - это тестовый запрос от Tilda при подключении webhook
    if (!Email) {
      console.log('Test request from Tilda - responding with "ok"');
      return res.send('ok');
    }

    // Проверяем валидность email
    if (!helpers.isValidEmail(Email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Tilda передаёт payment как объект {sys, orderid, amount, products}
    const order_id = paymentData?.orderid || req.body.order_id;
    const amount = paymentData?.amount || req.body.amount;
    const isPaid = !!(paymentData?.orderid); // если есть orderid — оплата прошла

    // Получаем или создаём пользователя
    let user = await nocodbService.getUserByEmail(Email);
    console.log('User found:', user ? `ID=${user.Id || user.ID}, Email=${user.Email}` : 'NOT FOUND');
    
    if (!user) {
      // Создаём нового пользователя
      const newUserData = {
        Email: Email,
        Имя: Name || '',
        Тариф: '🥈Базовый',
        'Количество рефералов': 0,
        'Оплатили подписку': 0,
        Бонусы: 0
      };

      // Если есть реферал
      if (utm_source) {
        newUserData['Кто привёл'] = utm_source;
      }

      user = await nocodbService.createUser(newUserData);
      console.log('New user created:', user.Id);

      // Обновляем счётчик рефералов у реферала
      if (utm_source) {
        await nocodbService.updateReferralCount(utm_source);
      }
    }

    // Если это покупка
    if (order_id && isPaid && course_id) {
      const bonusAmount = helpers.calculatePurchaseBonuses(amount, config);
      
      const purchaseData = {
        Email: Email,
        order_id: order_id.toString(),
        Оплата: 'Да',
        Покупатель: user.Id,
        'ID курса': course_id,
        'Бонусы начислить': bonusAmount
      };

      await nocodbService.createPurchase(purchaseData);
      console.log('Purchase created for user:', user.Id);

      // Начисляем бонусы покупателю
      await nocodbService.updateUserBonuses(user.Id, bonusAmount);
      console.log(`Bonuses added to user ${user.Id}: ${bonusAmount}`);

      // Если есть реферал - начисляем бонусы рефералу
      if (user['Кто привёл']) {
        const referralBonus = config.bonuses.referral;
        // Находим реферала по его реферальному коду/ID
        const referrer = await nocodbService.getUserById(user['Кто привёл']);
        if (referrer && referrer.Id) {
          await nocodbService.updateUserBonuses(referrer.Id, referralBonus);
          console.log(`Referral bonus added to user ${referrer.Id}: ${referralBonus}`);
          await nocodbService.updateReferralCount(referrer.Id);
        } else {
          console.warn('Referrer not found for:', user['Кто привёл']);
        }
      }
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      user_id: user.Id
    });

  } catch (error) {
    console.error('Webhook error:', error);
    helpers.handleAPIError(error, res);
  }
});

/**
 * POST /api/webhook/tilda/signup
 * Обработка регистрации пользователя
 */
router.post('/tilda/signup', async (req, res) => {
  try {
    const { Email, Name, utm_source } = req.body;

    // Тестовый запрос от Tilda при подключении webhook
    if (!Email) {
      return res.send('ok');
    }

    if (!helpers.isValidEmail(Email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Проверяем существует ли пользователь
    let user = await nocodbService.getUserByEmail(Email);
    
    if (user) {
      return res.json({
        success: true,
        message: 'User already exists',
        user_id: user.ID
      });
    }

    // Создаём пользователя
    const newUserData = {
      Email: Email,
      Имя: Name || '',
      Тариф: '🥈Базовый',
      'Количество рефералов': 0,
      'Оплатили подписку': 0,
      Бонусы: 300  // Приветственный бонус
    };

    // Если есть реферал
    if (utm_source) {
      newUserData['Кто привёл'] = utm_source;
    }

    user = await nocodbService.createUser(newUserData);

    // Обновляем счётчик рефералов
    if (utm_source) {
      await nocodbService.updateReferralCount(utm_source);
    }

    res.json({
      success: true,
      message: 'User created successfully',
      user_id: user.ID
    });

  } catch (error) {
    helpers.handleAPIError(error, res);
  }
});

module.exports = router;
