const express = require('express');
const router = express.Router();
const nocodbService = require('../services/nocodb');
const helpers = require('../utils/helpers');
const config = require('../config');

/**
 * POST /api/widget/courses
 * Получить список курсов пользователя для таблицы
 */
router.post('/courses', async (req, res) => {
  try {
    const { user_email, offset = 0, limit = 10 } = req.body;

    if (!user_email || !helpers.isValidEmail(user_email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Получаем пользователя
    const user = await nocodbService.getUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Получаем курсы
    const coursesData = await nocodbService.getUserCourses(
      user_email,
      parseInt(offset),
      parseInt(limit)
    );

    // Генерируем HTML строки таблицы
    const records = coursesData.courses.map(course => ({
      table_content: helpers.generateCourseTableRow(course)
    }));

    // Формируем ответ в формате Collabza
    const response = {
      records: records,
      total: coursesData.total
    };

    // Добавляем offset если есть ещё данные
    if (coursesData.hasMore) {
      response.offset = parseInt(offset) + parseInt(limit);
    }

    res.json(response);
  } catch (error) {
    helpers.handleAPIError(error, res);
  }
});

/**
 * POST /api/widget/referrals
 * Получить реферальную информацию
 */
router.post('/referrals', async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email || !helpers.isValidEmail(user_email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Получаем пользователя
    const user = await nocodbService.getUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Получаем рефералов
    const referralsData = await nocodbService.getUserReferrals(user.ID);

    // Генерируем HTML
    const html = helpers.generateReferralHTML(user, referralsData);

    // Формируем ответ в формате Collabza
    res.json({
      records: [
        { html: html }
      ]
    });
  } catch (error) {
    helpers.handleAPIError(error, res);
  }
});

/**
 * POST /api/widget/profile
 * Получить информацию профиля
 */
router.post('/profile', async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email || !helpers.isValidEmail(user_email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Получаем пользователя
    const user = await nocodbService.getUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Генерируем HTML профиля
    const html = helpers.generateProfileHTML(user);

    res.json({
      records: [
        { html: html }
      ]
    });
  } catch (error) {
    helpers.handleAPIError(error, res);
  }
});

/**
 * POST /api/widget/purchases
 * Получить историю покупок
 */
router.post('/purchases', async (req, res) => {
  try {
    const { user_email, offset = 0, limit = 10 } = req.body;

    if (!user_email || !helpers.isValidEmail(user_email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email'
      });
    }

    // Получаем пользователя
    const user = await nocodbService.getUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Получаем покупки
    const purchasesData = await nocodbService.getUserPurchases(
      user_email,
      parseInt(offset),
      parseInt(limit)
    );

    // Генерируем HTML строки таблицы
    const records = purchasesData.purchases.map(purchase => {
      const courseName = purchase['Название курса'] || 'Курс';
      const amount = purchase['Бонусы начислить'] || 0;
      const date = helpers.formatDate(purchase.Created);
      const status = purchase.Оплата === 'Да' ? '✅ Оплачено' : '⏳ Ожидание';
      
      return {
        table_content: `<tr>
          <td>${date}</td>
          <td>${courseName}</td>
          <td>${amount} ₽</td>
          <td>${status}</td>
        </tr>`
      };
    });

    const response = {
      records: records,
      total: purchasesData.total
    };

    if (purchasesData.hasMore) {
      response.offset = parseInt(offset) + parseInt(limit);
    }

    res.json(response);
  } catch (error) {
    helpers.handleAPIError(error, res);
  }
});

module.exports = router;
