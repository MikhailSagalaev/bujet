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
    console.log('Webhook received:', req.body);

    const {
      Email,
      Name,
      order_id,
      payment,
      course_id,
      amount,
      utm_source  // ID реферала
    } = req.body;

    // Проверяем обязательные поля
    if (!Email || !helpers.isValidEmail(Email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Получаем или создаём пользователя
    let user = await nocodbService.getUserByEmail(Email);
    
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
      console.log('New user created:', user.ID);

      // Обновляем счётчик рефералов у реферала
      if (utm_source) {
        await nocodbService.updateReferralCount(utm_source);
      }
    }

    // Если это покупка
    if (order_id && payment === 'Да' && course_id) {
      // Создаём покупку
      const bonusAmount = helpers.calculatePurchaseBonuses(amount, config);
      
      const purchaseData = {
        Email: Email,
        order_id: order_id.toString(),
        Оплата: 'Да',
        Покупатель: user.ID,
        'ID курса': course_id,
        'Бонусы начислить': bonusAmount
      };

      await nocodbService.createPurchase(purchaseData);
      console.log('Purchase created for user:', user.ID);

      // Начисляем бонусы покупателю
      await nocodbService.updateUserBonuses(user.ID, bonusAmount);
      console.log(`Bonuses added to user ${user.ID}: ${bonusAmount}`);

      // Если есть реферал - начисляем бонусы рефералу
      if (user['Кто привёл']) {
        const referralBonus = config.bonuses.referral;
        await nocodbService.updateUserBonuses(user['Кто привёл'], referralBonus);
        console.log(`Referral bonus added to ${user['Кто привёл']}: ${referralBonus}`);
        
        // Обновляем счётчик оплативших у реферала
        await nocodbService.updateReferralCount(user['Кто привёл']);
      }
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      user_id: user.ID
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

    if (!Email || !helpers.isValidEmail(Email)) {
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
