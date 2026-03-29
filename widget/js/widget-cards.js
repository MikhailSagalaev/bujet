/**
 * Виджет личного кабинета для блока T396 (#rec543521496)
 * v4 - с логированием для отладки
 */
(function () {
  'use strict';

  var API_URL = 'https://app.e-budget.ru/api';
  var REC_ID = '543521496';

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

  function elem(elemId) {
    var sel = '#rec' + REC_ID + ' .tn-elem__' + REC_ID + elemId + ' .tn-atom';
    var el = document.querySelector(sel);
    if (!el) console.warn('[widget-cards] NOT FOUND:', sel);
    return el;
  }

  function setText(elemId, text) {
    var el = elem(elemId);
    if (el) el.innerHTML = text;
  }

  function fillData(user) {
    console.log('[widget-cards] fillData user:', user);

    var name = user['Имя'] || user['Name'] || 'Пользователь';
    setText('1675010500282', 'Привет, <span>' + name + '</span>!');

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

    var refLink = 'https://e-budget.ru/?r=' + (user['Id'] || user['ID'] || '');
    console.log('[widget-cards] refLink:', refLink);
    var btnEl = elem('1675015783157');
    if (btnEl) {
      btnEl.innerHTML = refLink;
      btnEl.style.cursor = 'pointer';
      btnEl.onclick = function () {
        navigator.clipboard.writeText(refLink).then(function () {
          var orig = btnEl.innerHTML;
          btnEl.innerHTML = 'Скопировано!';
          setTimeout(function () { btnEl.innerHTML = orig; }, 2000);
        });
      };
    }

    setText('1675016424996', String(user['Количество рефералов'] || '0'));
    setText('1675016455904', String(user['Оплатили подписку'] || '0'));
    setText('1676984464176', (user['Бонусы'] || '0') + ' б.');
  }

  function init() {
    console.log('[widget-cards] v4 init');

    var profile = getProfile();
    console.log('[widget-cards] profile:', profile);

    var userEmail = profile.login ? decodeURIComponent(profile.login) : null;
    if (!userEmail) {
      console.warn('[widget-cards] no email in profile, skipping');
      return;
    }

    console.log('[widget-cards] fetching profile for:', userEmail);

    fetch(API_URL + '/widget/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail })
    })
      .then(function (res) {
        console.log('[widget-cards] API response status:', res.status);
        return res.json();
      })
      .then(function (data) {
        console.log('[widget-cards] API data:', data);
        if (data.user) {
          fillData(data.user);
        } else {
          console.error('[widget-cards] no data.user in response:', JSON.stringify(data));
        }
      })
      .catch(function (err) {
        console.error('[widget-cards] fetch error:', err);
      });
  }

  // Запускаем с небольшой задержкой чтобы T396 успел отрендериться
  function delayedInit() {
    setTimeout(init, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedInit);
  } else {
    delayedInit();
  }
})();
