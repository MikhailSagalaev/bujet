/**
 * Виджет таблицы курсов (аналог Collabza e7509dde...)
 * Использование: подключить на странице Тільды с блоком T431
 */
(function() {
  'use strict';

  // Конфигурация
  const CONFIG = {
    API_URL: 'https://your-server.ru/api',  // ИЗМЕНИТЬ НА ВАШ URL
    BLOCK_ID: '#rec543510144',  // ID блока Тільды с таблицей
    ENDPOINT: '/widget/courses'
  };

  // Переводы для кнопки "Загрузить ещё"
  const TRANSLATIONS = {
    EN: 'Load more',
    RU: 'Загрузить ещё',
    FR: 'Charger plus',
    DE: 'Mehr laden',
    ES: 'Carga más',
    PT: 'Carregue mais',
    UK: 'Завантажити ще',
    JA: 'もっと読み込む',
    ZH: '裝載更多'
  };

  function getLoadMoreText() {
    const lang = window.tildaBrowserLang || 'RU';
    return TRANSLATIONS[lang] || TRANSLATIONS.EN;
  }

  $(document).ready(function() {
    const block_id = CONFIG.BLOCK_ID.substring(4);
    const block_template = $(CONFIG.BLOCK_ID).removeClass('r_hidden');
    
    if (block_template.length === 0) {
      console.error('Widget Error: Block not found:', CONFIG.BLOCK_ID);
      return;
    }

    // Удаляем скрипты из блока
    block_template.find('script').remove();

    // Оборачиваем в контейнер
    block_template.wrap(`<div id="collabza_rec${block_id}" class="r"></div>`).remove();
    block_template.removeClass('r');
    const collabza_wrapper = $(`#collabza_rec${block_id}`);

    // Добавляем кнопку "Загрузить ещё"
    block_template.find('.t431__table-wrapper').append(
      $('<div class="t431__btnwrapper collabza_loadmore" style="width:100%; text-align:center; margin-top:40px; display:none;">' +
        '<a class="t-btn t-btn_sm"><table style="width:100%; height:100%"><tbody><tr><td>' + 
        getLoadMoreText() + 
        '</td></tr></tbody></table></a>' +
        '</div>')
    );

    // Получаем профиль пользователя из localStorage (Tilda Members)
    const project_id = $('#allrecords').attr('data-tilda-project-id');
    const profile = JSON.parse(
      localStorage.getItem(`tilda_members_profile${project_id}`) ||
      localStorage.getItem('memberarea_profile') ||
      '{}'
    );

    if (!profile.login) {
      console.error('Widget Error: User not logged in');
      collabza_wrapper.html('<p style="text-align:center; padding:20px;">Пожалуйста, войдите в систему</p>');
      return;
    }

    let block;
    let load_more;
    let currentOffset = null;

    // Функция загрузки данных
    function loadCourses(offset) {
      if (load_more) {
        load_more.off('click');
        load_more.find('td').text('...');
      }

      $.ajax({
        url: CONFIG.API_URL + CONFIG.ENDPOINT,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          user_email: decodeURIComponent(profile.login),
          offset: offset || 0,
          limit: 10
        }),
        success: function(data) {
          if (!data.records || data.records.length === 0) {
            if (!offset) {
              block.find('.t431__table-wrapper').html(
                '<p style="text-align:center; padding:40px;">У вас пока нет курсов</p>'
              );
            }
            if (load_more) {
              load_more.remove();
            }
            return;
          }

          // Генерируем HTML таблицы
          let tableHTML = '';
          data.records.forEach(function(record) {
            if (record.table_content) {
              tableHTML += record.table_content + '\n';
            }
          });

          // Вставляем данные
          block.find('.t431__data-part2').html(tableHTML);
          
          if (offset) {
            block.find('.t431__data-part1').html('');
          } else {
            block.find('.t431__table tbody').empty();
          }

          // Инициализируем таблицу Тільды
          if (typeof t431_init === 'function') {
            t431_init(block_id);
          }

          // Обрабатываем пагинацию
          if (data.offset) {
            currentOffset = data.offset;
            load_more.find('td').text(getLoadMoreText());
            load_more.show();
            load_more.click(function() {
              loadCourses(currentOffset);
            });
          } else {
            if (load_more) {
              load_more.remove();
            }
          }

          // Триггерим событие resize
          $(window).trigger('resize');
          window.dispatchEvent(new Event('resize'));
          
          // Кастомное событие
          block.trigger('collabza_loaded');
        },
        error: function(xhr) {
          console.error('Widget Error:', xhr);
          const errorMsg = xhr.responseJSON?.message || 'Ошибка загрузки данных';
          block.find('.t431__table-wrapper').html(
            `<p style="text-align:center; padding:40px; color:#e74c3c;">${errorMsg}</p>`
          );
        }
      });
    }

    // Инициализация
    collabza_wrapper.on('collabza_init', function() {
      block = block_template.clone();
      collabza_wrapper.empty();
      collabza_wrapper.append(block);
      block.find('.t431__table tbody').empty();
      load_more = block.find('.collabza_loadmore');
      
      loadCourses(null);
    });

    collabza_wrapper.trigger('collabza_init');
  });
})();
