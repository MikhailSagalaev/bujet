#!/usr/bin/env node

/**
 * Скрипт автоматической настройки таблиц NocoDB
 * 
 * Использование:
 * node scripts/setup-nocodb.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация
const CONFIG = {
  NOCODB_URL: process.env.NOCODB_URL || 'http://localhost:8080',
  NOCODB_TOKEN: process.env.NOCODB_TOKEN || 'wOYmcdqxhT91pYQ1OhIQXQXGkyIAjkMTVXsBlUzs',
  PROJECT_ID: process.env.NOCODB_PROJECT_ID || 'p0o848dnq1jfzu0',
  BASE_ID: process.env.NOCODB_BASE_ID || 'p0o848dnq1jfzu0'
};

const api = axios.create({
  baseURL: `${CONFIG.NOCODB_URL}/api/v2`,
  headers: {
    'xc-token': CONFIG.NOCODB_TOKEN,
    'Content-Type': 'application/json'
  }
});

// Схема таблицы Users
const USERS_TABLE_SCHEMA = {
  table_name: 'Users',
  title: 'Users',
  columns: [
    {
      column_name: 'Имя',
      title: 'Имя',
      uidt: 'SingleLineText'
    },
    {
      column_name: 'Email',
      title: 'Email',
      uidt: 'Email',
      unique: true
    },
    {
      column_name: 'Тариф',
      title: 'Тариф',
      uidt: 'SingleSelect',
      dtxp: "'🥈Базовый','🥇Про'",
      dtxs: '🥈Базовый'
    },
    {
      column_name: 'Дата продления',
      title: 'Дата продления',
      uidt: 'DateTime'
    },
    {
      column_name: 'Количество рефералов',
      title: 'Количество рефералов',
      uidt: 'Number',
      dtxp: '0'
    },
    {
      column_name: 'Оплатили подписку',
      title: 'Оплатили подписку',
      uidt: 'Number',
      dtxp: '0'
    },
    {
      column_name: 'Бонусы',
      title: 'Бонусы',
      uidt: 'Number',
      dtxp: '0'
    }
  ]
};

// Формулы для таблицы Users (создаются в правильном порядке)
const USERS_FORMULAS = [
  // Простые формулы (не зависят от других формул)
  {
    column_name: 'html_psy',
    title: 'html_psy',
    uidt: 'Formula',
    formula_raw: 'CONCAT("<script>$(\\\".fio .tn-atom\\\").html(\\\"", IF({Имя}, {Имя}, ""), "\\\");</script>")'
  },
  {
    column_name: 'Реферальная ссылка1',
    title: 'Реферальная ссылка1',
    uidt: 'Formula',
    formula_raw: 'CONCAT("<script>$(\'.example-1 .tn-atom\').text(\'https://e-budget.ru/members/signup?utm_source=", {Id}, "&utm_medium=referral&utm_campaign=friends>\');</script>")'
  },
  {
    column_name: 'Tilda Статус подписки',
    title: 'Tilda Статус подписки',
    uidt: 'Formula',
    formula_raw: 'CONCAT("</br></span><b>Текущий тариф:</b> ", IF({Тариф}, {Тариф}, "🥈Базовый"), "<br><a href=\'https://e-budget.ru/pro\'>Улучшить тариф ➤</a></br>")'
  },
  {
    column_name: 'Code_block',
    title: 'Code_block',
    uidt: 'Formula',
    formula_raw: 'IF({Тариф} = "🥇Про", "<script>localStorage.setItem(\\"pro\\", 1);$(\\\".saleicon\\\").show();</script>", "<script>localStorage.setItem(\\"pro\\", 0);$(\\\".saleicon\\\").hide();</script>")'
  },
  {
    column_name: 'Dashboard',
    title: 'Dashboard',
    uidt: 'Formula',
    formula_raw: 'CONCAT("<script>$(\\\".tn-elem__5435214961675016424996 .tn-atom\\\").text(", IF({Количество рефералов}, {Количество рефералов}, 0), ");$(\\\".tn-elem__5435214961675016455904 .tn-atom\\\").text(", IF({Оплатили подписку}, {Оплатили подписку}, 0), ");$(\\\".tn-elem__5435214961676984464176 .tn-atom\\\").text(", IF({Бонусы}, {Бонусы}, 0), "+\\" б.\\");</script>")'
  },
  {
    column_name: 'Списать бонусы',
    title: 'Списать бонусы',
    uidt: 'Formula',
    formula_raw: 'CONCAT("<script>function applyBonus(){$(\\\".t-btn__bonus\\\").remove();promo={promocode:\\"BONUS\\",discountsum:Math.min(window.tcart.amount-1,", IF({Бонусы}, {Бонусы}, 0), ")};t_input_promocode__addPromocode(promo);}$(\'<div onclick=\\"applyBonus();\\" class=\\"t-btn t-btn__bonus\\" style=\\"width:100%;\\">Списать бонусы (доступно ", IF({Бонусы}, {Бонусы}, 0), ")</div>\').insertBefore(\\".t706 .t-form__submit\\");</script>")'
  }
];

// Формулы, зависящие от других формул (создаются после)
const USERS_FORMULAS_DEPENDENT = [
  {
    column_name: 'status_prof',
    title: 'status_prof',
    uidt: 'Formula',
    formula_raw: 'CONCAT("$(\\\".tarif .tn-atom\\\").html(\\\"", {Tilda Статус подписки}, "\\\");")' 
  },
  {
    column_name: 'HTML_ADD',
    title: 'HTML_ADD',
    uidt: 'Formula',
    formula_raw: 'CONCAT({Dashboard}, {Реферальная ссылка1}, {Списать бонусы}, {Code_block})'
  }
];

// Схема таблицы Courses
const COURSES_TABLE_SCHEMA = {
  table_name: 'Courses',
  title: 'Courses',
  columns: [
    {
      column_name: 'Название',
      title: 'Название',
      uidt: 'SingleLineText'
    },
    {
      column_name: 'Ссылка',
      title: 'Ссылка',
      uidt: 'URL'
    },
    {
      column_name: 'date',
      title: 'date',
      uidt: 'DateTime'
    },
    {
      column_name: 'Дата',
      title: 'Дата',
      uidt: 'DateTime'
    }
  ]
};

// Формулы для таблицы Courses
const COURSES_FORMULAS = [
  {
    column_name: 'Tilda_Ссылка',
    title: 'Tilda_Ссылка',
    uidt: 'Formula',
    formula_raw: 'CONCAT("Перейти button=", {Ссылка})'
  }
];

// Схема таблицы Purchases
const PURCHASES_TABLE_SCHEMA = {
  table_name: 'Purchases',
  title: 'Purchases',
  columns: [
    {
      column_name: 'Email',
      title: 'Email',
      uidt: 'Email'
    },
    {
      column_name: 'order_id',
      title: 'order_id',
      uidt: 'SingleLineText'
    },
    {
      column_name: 'Оплата',
      title: 'Оплата',
      uidt: 'SingleSelect',
      dtxp: "'Да','Нет'"
    },
    {
      column_name: 'Бонусы списать',
      title: 'Бонусы списать',
      uidt: 'Number'
    },
    {
      column_name: 'Бонусы начислить',
      title: 'Бонусы начислить',
      uidt: 'Number'
    },
    {
      column_name: 'Название курса',
      title: 'Название курса',
      uidt: 'SingleLineText'
    },
    {
      column_name: 'Date',
      title: 'Date',
      uidt: 'DateTime'
    },
    {
      column_name: 'Дата создания',
      title: 'Дата создания',
      uidt: 'SingleLineText'
    }
  ]
};

async function createTable(schema) {
  try {
    console.log(`\n📋 Создание таблицы ${schema.title}...`);
    
    const response = await api.post(`/meta/bases/${CONFIG.BASE_ID}/tables`, schema);
    
    console.log(`✅ Таблица ${schema.title} создана с ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.msg?.includes('already exists')) {
      console.log(`⚠️  Таблица ${schema.title} уже существует`);
      // Получаем существующую таблицу
      const tables = await api.get(`/meta/bases/${CONFIG.BASE_ID}/tables`);
      const existingTable = tables.data.list.find(t => t.title === schema.title);
      return existingTable;
    }
    throw error;
  }
}

async function addFormulaColumn(tableId, formula) {
  try {
    console.log(`  ➕ Добавление формулы ${formula.title}...`);
    
    const response = await api.post(`/meta/tables/${tableId}/columns`, formula);
    
    console.log(`  ✅ Формула ${formula.title} добавлена`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(`  ⚠️  Формула ${formula.title} уже существует или ошибка: ${error.response.data.msg}`);
    } else {
      console.error(`  ❌ Ошибка добавления формулы ${formula.title}:`, error.message);
    }
  }
}

async function createLinkColumn(tableId, linkConfig) {
  try {
    console.log(`  🔗 Создание связи ${linkConfig.title}...`);
    
    const response = await api.post(`/meta/tables/${tableId}/columns`, linkConfig);
    
    console.log(`  ✅ Связь ${linkConfig.title} создана`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(`  ⚠️  Связь ${linkConfig.title} уже существует: ${error.response.data.msg}`);
    } else {
      console.error(`  ❌ Ошибка создания связи ${linkConfig.title}:`, error.message);
    }
  }
}

async function importCSVData(tableId, csvFilePath) {
  try {
    console.log(`\n📥 Импорт данных из ${csvFilePath}...`);
    
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const record = {};
      headers.forEach((header, index) => {
        record[header.trim()] = values[index]?.trim() || null;
      });
      records.push(record);
    }
    
    // Импортируем записи пачками по 100
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await api.post(`/tables/${tableId}/records`, batch);
      console.log(`  ✅ Импортировано ${Math.min(i + batchSize, records.length)} из ${records.length} записей`);
    }
    
    console.log(`✅ Импорт завершён: ${records.length} записей`);
  } catch (error) {
    console.error(`❌ Ошибка импорта данных:`, error.message);
  }
}

async function main() {
  console.log('🚀 Начало настройки NocoDB...\n');
  console.log(`📍 URL: ${CONFIG.NOCODB_URL}`);
  console.log(`📍 Project ID: ${CONFIG.PROJECT_ID}\n`);
  
  try {
    // 1. Создаём таблицу Users
    const usersTable = await createTable(USERS_TABLE_SCHEMA);
    
    // 2. Добавляем формулы в Users (базовые)
    console.log('\n📝 Добавление базовых формул в таблицу Users...');
    for (const formula of USERS_FORMULAS) {
      await addFormulaColumn(usersTable.id, formula);
    }
    
    // 2.5 Добавляем зависимые формулы в Users (после базовых)
    console.log('\n📝 Добавление зависимых формул в таблицу Users...');
    for (const formula of USERS_FORMULAS_DEPENDENT) {
      await addFormulaColumn(usersTable.id, formula);
    }
    
    // 3. Создаём таблицу Courses
    const coursesTable = await createTable(COURSES_TABLE_SCHEMA);
    
    // 4. Добавляем формулы в Courses
    console.log('\n📝 Добавление формул в таблицу Courses...');
    for (const formula of COURSES_FORMULAS) {
      await addFormulaColumn(coursesTable.id, formula);
    }
    
    // 5. Создаём таблицу Purchases
    const purchasesTable = await createTable(PURCHASES_TABLE_SCHEMA);
    
    // 6. Создаём связь "Кто привёл" (Users -> Users)
    console.log('\n🔗 Создание связей...');
    await createLinkColumn(usersTable.id, {
      column_name: 'Кто привёл',
      title: 'Кто привёл',
      uidt: 'LinkToAnotherRecord',
      parentId: usersTable.id,
      childId: usersTable.id,
      type: 'mm' // many to many, NocoDB автоматически создаст junction table
    });
    
    // 7. Создаём связь Purchases -> Users (Покупатель)
    await createLinkColumn(purchasesTable.id, {
      column_name: 'Покупатель',
      title: 'Покупатель',
      uidt: 'LinkToAnotherRecord',
      parentId: usersTable.id,
      childId: purchasesTable.id,
      type: 'hm' // has many
    });
    
    // 8. Создаём связь Purchases -> Courses (ID курса)
    await createLinkColumn(purchasesTable.id, {
      column_name: 'ID курса',
      title: 'ID курса',
      uidt: 'LinkToAnotherRecord',
      parentId: coursesTable.id,
      childId: purchasesTable.id,
      type: 'hm'
    });
    
    // 9. Импортируем данные (опционально)
    const shouldImportData = process.argv.includes('--import-data');
    if (shouldImportData) {
      console.log('\n📥 Импорт данных из CSV...');
      await importCSVData(usersTable.id, path.join(__dirname, '../Users-Clean.csv'));
      await importCSVData(coursesTable.id, path.join(__dirname, '../Курсы-Clean.csv'));
      await importCSVData(purchasesTable.id, path.join(__dirname, '../Покупки-Clean.csv'));
    }
    
    console.log('\n✅ Настройка завершена успешно!');
    console.log('\n📊 Созданные таблицы:');
    console.log(`  - Users: ${usersTable.id}`);
    console.log(`  - Courses: ${coursesTable.id}`);
    console.log(`  - Purchases: ${purchasesTable.id}`);
    
    console.log('\n💡 Обнови backend/config.js с новыми ID таблиц');
    
  } catch (error) {
    console.error('\n❌ Ошибка:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Запуск
main();
