/**
 * Виджет карточек — реферальная ссылка, профиль, бонусы
 *
 * Использование в HTML-блоке Tilda (T123):
 *
 * Вариант 1 — реферальная программа:
 * <script data-type="referrals" src="https://app.e-budget.ru/widget/js/widget-cards.js"></script>
 *
 * Вариант 2 — профиль пользователя:
 * <script data-type="profile" src="https://app.e-budget.ru/widget/js/widget-cards.js"></script>
 *
 * Скрипт сам найдёт свой тег и вставит данные в родительский блок.
 */
(function () {
  'use strict';

  const API_URL = 'https://app.e-budget.ru/api';

  const ENDPOINTS = {
    referrals: '/widget/referrals',
    profile: '/widget/profile',
  };

  // Находим текущий тег <script> чтобы понять тип виджета и куда вставлять
  var scripts = document.querySelectorAll('script[src*="widget-cards.js"]');
  var currentScript = scripts[scripts.length - 1];
  var widgetType = (currentScript && currentScript.getAttribute('data-type')) || 'referrals';
  var endpoint = ENDPOINTS[widgetType];

  if (!endpoint) {
    console.error('widget-cards: unknown data-type "' + widgetType + '"');
    return;
  }

  // Контейнер — родительский элемент тега script
  var container = currentScript && currentScript.parentNode;
  if (!container) {
    console.error('widget-cards: no parent container found');
    return;
  }

  function getProfile() {
    var projectId = '';
    var allrecords = document.getElementById('allrecords');
    if (allrecords) projectId = allrecords.getAttribute('data-tilda-project-id') || '';
    try {
      return JSON.parse(
        localStorage.getItem('tilda_members_profile' + projectId) ||
        localStorage.getItem('memberarea_profile') ||
        '{}'
      );
    } catch (e) {
      return {};
    }
  }

  function render(html) {
    var div = document.createElement('div');
    div.className = 'ebudget-widget';
    div.innerHTML = html;
    container.appendChild(div);
  }

  function load() {
    var profile = getProfile();
    var userEmail = profile.login ? decodeURIComponent(profile.login) : null;

    if (!userEmail) {
      render('<p style="text-align:center;padding:20px;">Пожалуйста, войдите в систему</p>');
      return;
    }

    fetch(API_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.records || data.records.length === 0) return;
        data.records.forEach(function (record) {
          if (record.html) render(record.html);
        });
        window.dispatchEvent(new Event('resize'));
      })
      .catch(function (err) {
        console.error('widget-cards error:', err);
        render('<p style="text-align:center;padding:20px;color:#e74c3c;">Ошибка загрузки данных</p>');
      });
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
