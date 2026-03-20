/**
 * Генерация реферальной ссылки
 */
function generateReferralLink(userId, baseUrl = 'https://e-budget.ru') {
  return `${baseUrl}/members/signup?utm_source=${userId}&utm_medium=referral&utm_campaign=friends`;
}

/**
 * Форматирование даты для отображения
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
}

/**
 * Генерация HTML строки таблицы для курса
 */
function generateCourseTableRow(course) {
  const courseName = course.Название || 'Без названия';
  const courseLink = course.Ссылка || '#';
  const purchaseDate = formatDate(course.purchaseDate);
  
  return `<tr>
    <td>${courseName}</td>
    <td>${purchaseDate}</td>
    <td><a href="${courseLink}" class="t-btn t-btn_xs" target="_blank">Перейти к курсу</a></td>
  </tr>`;
}

/**
 * Генерация HTML для реферальной информации
 */
function generateReferralHTML(user, referralsData) {
  const referralLink = generateReferralLink(user.ID);
  const bonuses = user.Бонусы || 0;
  const referralsCount = referralsData.count || 0;
  const paidReferrals = referralsData.paidCount || 0;
  
  return `
    <div class="referral-info">
      <div class="referral-section">
        <h3>Ваша реферальная ссылка</h3>
        <div class="referral-link-box">
          <input type="text" value="${referralLink}" readonly onclick="this.select()" />
          <button onclick="navigator.clipboard.writeText('${referralLink}'); alert('Ссылка скопирована!')">
            Копировать
          </button>
        </div>
      </div>
      
      <div class="referral-stats">
        <div class="stat-item">
          <div class="stat-value">${referralsCount}</div>
          <div class="stat-label">Приглашено друзей</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${paidReferrals}</div>
          <div class="stat-label">Оплатили подписку</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${bonuses} ₽</div>
          <div class="stat-label">Доступно бонусов</div>
        </div>
      </div>
      
      <div class="referral-description">
        <p>Приглашайте друзей и получайте бонусы!</p>
        <ul>
          <li>Вы получаете ${bonuses} бонусов за каждого друга</li>
          <li>Ваш друг получает скидку на первую покупку</li>
          <li>Бонусы можно использовать для оплаты курсов</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * Генерация HTML для профиля пользователя
 */
function generateProfileHTML(user) {
  const name = user.Имя || 'Пользователь';
  const email = user.Email || '';
  const tariff = user.Тариф || '🥈Базовый';
  const renewalDate = formatDate(user['Дата продления']);
  
  return `
    <div class="profile-info">
      <div class="profile-header">
        <h2>${name}</h2>
        <p class="profile-email">${email}</p>
      </div>
      
      <div class="profile-tariff">
        <div class="tariff-badge">${tariff}</div>
        ${renewalDate ? `<p class="renewal-date">Продление: ${renewalDate}</p>` : ''}
        <a href="https://e-budget.ru/pro" class="t-btn">Улучшить тариф</a>
      </div>
    </div>
  `;
}

/**
 * Расчёт бонусов за покупку
 */
function calculatePurchaseBonuses(amount, config) {
  // Можно добавить логику расчёта в зависимости от суммы
  return config.bonuses.purchase;
}

/**
 * Валидация email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Обработка ошибок API
 */
function handleAPIError(error, res) {
  console.error('API Error:', error);
  
  const statusCode = error.response?.status || 500;
  const message = error.response?.data?.message || error.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: true,
    message: message
  });
}

module.exports = {
  generateReferralLink,
  formatDate,
  generateCourseTableRow,
  generateReferralHTML,
  generateProfileHTML,
  calculatePurchaseBonuses,
  isValidEmail,
  handleAPIError
};
