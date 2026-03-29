/**
 * Виджет личного кабинета для блока T396 (#rec543521496)
 * Заполняет данные пользователя в существующие элементы Tilda
 *
 * Использование — вставить в HTML-блок на странице:
 * <script src="https://app.e-budget.ru/widget/js/widget-cards.js"></script>
 */
(function () {
  'use strict';

  var API_URL = 'https://app.e-budget.ru/api';
  var REC_ID = '543521496'; // ID блока T396

  function getProfile() {
    var projectId = '';
    var el = document.getElementById('allrecords');
    if (el) projectId = el.getAttribute('data-tilda-project-id') || '';
    try {
      return JSON.parse(
        localStorage.getItem('tilda_members_profile' + projectId) ||
        localStorage.getItem('memberarea_profile') ||
        '{}'
      );
    } catch (e) { return {}; }
  }

  // Найти элемент блока по data-elem-id
  function elem(elemId) {
    return document.querySelector(
      '#rec' + REC_ID + ' .tn-elem__' + REC_ID + elemId + ' .tn-atom'
    );
  }

  function setText(elemId, text) {
    var el = elem(elemId);
    if (el) el.innerHTML = text;
  }

  function fillData(user) {
    // Имя
    var name = user['Имя'] || user['Name'] || 'Пользователь';
    setText('1675010500282', 'Привет, <span>' + name + '</span>!');

    // Тариф и дата продления
    var tariff = user['Тариф'] || '🥈Базовый';
    var renewal = user['Дата продления'] || '';
    if (renewal) {
      var d = new Date(renewal);
      renewal = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    setText('1680717867310',
      '<strong>Текущий тариф:</strong> ' + tariff + '<br>' +
      '<strong>Дата продления:</strong> ' + (renewal || 'не указана')
    );

    // Реферальная ссылка
    var refLink = 'https://e-budget.ru/?r=' + (user['Id'] || user['ID'] || '');
    var btnEl = elem('1675015783157');
    if (btnEl) {
      btnEl.innerHTML = refLink;
      btnEl.style.cursor = 'pointer';
      btnEl.title = 'Нажмите чтобы скопировать';
      btnEl.onclick = function () {
        navigator.clipboard.writeText(refLink).then(function () {
          var orig = btnEl.innerHTML;
          btnEl.innerHTML = 'Скопировано!';
          setTimeout(function () { btnEl.innerHTML = orig; }, 2000);
        });
      };
    }

    // Счётчики рефералов
    setText('1675016424996', user['Количество рефералов'] || '0');
    setText('1675016455904', user['Оплатили подписку'] || '0');

    // Бонусы
    setText('1676984464176', (user['Бонусы'] || '0') + ' б.');
  }

  function init() {
    var profile = getProfile();
    var userEmail = profile.login ? decodeURIComponent(profile.login) : null;

    if (!userEmail) return; // не авторизован — ничего не делаем

    fetch(API_URL + '/widget/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.user) fillData(data.user);
      })
      .catch(function (err) {
        console.error('widget-cards error:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
