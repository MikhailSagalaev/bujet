/**
 * Виджет карточек (аналог Collabza 5a68810f...)
 * Использование: для отображения реферальной информации, профиля и т.д.
 */
(function() {
  'use strict';

  // Конфигурация
  const CONFIG = {
    API_URL: 'https://app.e-budget.ru/api',
    BLOCK_ID: '#rec556083146',  // ID блока Тільды
    ENDPOINT: '/widget/referrals'  // Можно менять: /widget/referrals, /widget/profile
  };

  $(document).ready(function() {
    const block_id = CONFIG.BLOCK_ID.substring(4);
    const block = $(CONFIG.BLOCK_ID).removeClass('r_hidden');
    
    if (block.length === 0) {
      console.error('Widget Error: Block not found:', CONFIG.BLOCK_ID);
      return;
    }

    // Оборачиваем в контейнер
    block.wrap(`<div id="rec${block_id}" class="r"></div>`).remove();
    block.removeClass('r');
    const container = $(`#rec${block_id}`);

    // Получаем профиль пользователя
    const project_id = $('#allrecords').attr('data-tilda-project-id');
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) ||
      localStorage.getItem('memberarea_profile') ||
      '{}'
    );

    if (!profile.login) {
      console.error('Widget Error: User not logged in');
      container.html('<p style="text-align:center; padding:20px;">Пожалуйста, войдите в систему</p>');
      return;
    }

    // Показываем загрузку
    container.html('<div style="text-align:center; padding:40px;"><div class="t-preloader__spinner"></div></div>');

    // Загружаем данные
    $.ajax({
      url: CONFIG.API_URL + CONFIG.ENDPOINT,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        user_email: decodeURIComponent(profile.login)
      }),
      success: function(data) {
        container.empty();

        if (!data.records || data.records.length === 0) {
          container.html('<p style="text-align:center; padding:40px;">Нет данных для отображения</p>');
          return;
        }

        // Для каждой записи клонируем блок
        data.records.forEach(function(record, index) {
          const item = block.clone(true).attr('id', `rec${block_id}_${index}`);
          
          if (record.html) {
            // Вставляем HTML в блок T123
            const contentDiv = item.find('.t123 > div > div');
            if (contentDiv.length > 0) {
              contentDiv.html(record.html);
            } else {
              // Если структура другая, пробуем найти первый div
              item.find('div').first().html(record.html);
            }
          }
          
          item.appendTo(container);
        });

        // Триггерим событие resize
        $(window).trigger('resize');
        window.dispatchEvent(new Event('resize'));
        
        // Кастомное событие
        container.trigger('collabza_loaded');
      },
      error: function(xhr) {
        console.error('Widget Error:', xhr);
        const errorMsg = xhr.responseJSON?.message || 'Ошибка загрузки данных';
        container.html(
          `<p style="text-align:center; padding:40px; color:#e74c3c;">${errorMsg}</p>`
        );
      }
    });
  });
})();
