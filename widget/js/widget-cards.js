/**
 * Виджет карточек (аналог Collabza 5a68810f...)
 * Показывает реферальную ссылку, бонусы, профиль пользователя
 *
 * Использование:
 * <script src="https://app.e-budget.ru/widget/js/widget-cards.js"></script>
 *
 * Настройка через data-атрибуты на блоке:
 * data-type="referrals"  — реферальная информация (по умолчанию)
 * data-type="profile"    — профиль пользователя
 *
 * Пример:
 * <div id="rec556083146" data-type="referrals"></div>
 */
(function () {
  'use strict';

  const API_URL = 'https://app.e-budget.ru/api';

  // Маппинг типов виджетов на API endpoints
  const ENDPOINTS = {
    referrals: '/widget/referrals',
    profile: '/widget/profile',
  };

  function getProfile() {
    const project_id = document.getElementById('allrecords')?.getAttribute('data-tilda-project-id');
    try {
      return JSON.parse(
        localStorage.getItem('tilda_members_profile' + project_id) ||
        localStorage.getItem('memberarea_profile') ||
        '{}'
      );
    } catch (e) {
      return {};
    }
  }

  function initWidget(blockEl) {
    const block_id = blockEl.id.replace('rec', '');
    const widgetType = blockEl.getAttribute('data-type') || 'referrals';
    const endpoint = ENDPOINTS[widgetType];

    if (!endpoint) {
      console.error('Widget: unknown data-type "' + widgetType + '"');
      return;
    }

    // Оборачиваем блок в контейнер (как Collabza)
    const wrapper = document.createElement('div');
    wrapper.id = 'collabza_rec' + block_id;
    wrapper.className = 'r';
    blockEl.parentNode.insertBefore(wrapper, blockEl);
    blockEl.classList.remove('r', 'r_hidden');
    wrapper.appendChild(blockEl);

    const profile = getProfile();
    const userEmail = profile.login ? decodeURIComponent(profile.login) : null;

    if (!userEmail) {
      blockEl.innerHTML = '<p style="text-align:center;padding:20px;">Пожалуйста, войдите в систему</p>';
      return;
    }

    // Запрос к API
    fetch(API_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.records || data.records.length === 0) return;

        // Клонируем блок для каждой записи (как Collabza)
        data.records.forEach(function (record, index) {
          const item = blockEl.cloneNode(true);
          item.id = 'rec' + block_id + '_' + index;

          // Ищем контейнер для HTML (T123 блок)
          const inner = item.querySelector('.t123 > div > div') || item;
          if (record.html) {
            inner.innerHTML = record.html;
          }

          wrapper.appendChild(item);
          window.dispatchEvent(new Event('resize'));
        });

        // Убираем оригинальный пустой блок
        blockEl.remove();
      })
      .catch(function (err) {
        console.error('Widget error:', err);
        blockEl.innerHTML = '<p style="text-align:center;padding:20px;color:#e74c3c;">Ошибка загрузки данных</p>';
      });
  }

  // Инициализируем все блоки с data-type на странице
  function init() {
    const blocks = document.querySelectorAll('[data-type="referrals"], [data-type="profile"]');
    blocks.forEach(function (block) {
      if (block.id) {
        initWidget(block);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
