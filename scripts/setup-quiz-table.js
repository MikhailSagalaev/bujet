#!/usr/bin/env node

/**
 * Скрипт для создания таблицы quiz_results в NocoDB
 * Запуск: node scripts/setup-quiz-table.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');

const NOCODB_URL = process.env.NOCODB_URL || 'http://localhost:8080';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;

if (!NOCODB_TOKEN) {
  console.error('❌ NOCODB_TOKEN не найден в .env файле');
  process.exit(1);
}

const api = axios.create({
  baseURL: NOCODB_URL,
  headers: {
    'xc-token': NOCODB_TOKEN,
    'Content-Type': 'application/json'
  }
});

async function createQuizTable() {
  try {
    console.log('🚀 Начинаем создание таблицы quiz_results...\n');

    // 1. Получаем список проектов
    console.log('📋 Получаем список проектов...');
    const projectsRes = await api.get('/api/v1/db/meta/projects');
    const projects = projectsRes.data.list;
    
    if (!projects || projects.length === 0) {
      console.error('❌ Проекты не найдены');
      process.exit(1);
    }

    const project = projects[0];
    console.log(`✅ Найден проект: ${project.title} (ID: ${project.id})\n`);

    // 2. Получаем базу данных проекта
    console.log('📋 Получаем базу данных...');
    const basesRes = await api.get(`/api/v1/db/meta/projects/${project.id}/bases`);
    const bases = basesRes.data.list;
    
    if (!bases || bases.length === 0) {
      console.error('❌ Базы данных не найдены');
      process.exit(1);
    }

    const base = bases[0];
    console.log(`✅ Найдена база: ${base.alias || base.id}\n`);

    // 3. Проверяем, существует ли таблица
    console.log('🔍 Проверяем существование таблицы quiz_results...');
    try {
      const tablesRes = await api.get(`/api/v1/db/meta/projects/${project.id}/tables`);
      const existingTable = tablesRes.data.list.find(t => t.table_name === 'quiz_results');
      
      if (existingTable) {
        console.log('⚠️  Таблица quiz_results уже существует');
        console.log(`   ID таблицы: ${existingTable.id}`);
        console.log('   Пропускаем создание.\n');
        return;
      }
    } catch (err) {
      // Продолжаем, если не удалось получить список таблиц
    }

    // 4. Создаём таблицу
    console.log('📝 Создаём таблицу quiz_results...');
    const tablePayload = {
      table_name: 'quiz_results',
      title: 'Quiz Results',
      columns: [
        {
          column_name: 'id',
          title: 'ID',
          uidt: 'ID',
          pk: true,
          ai: true,
          rqd: true
        },
        {
          column_name: 'email',
          title: 'Email',
          uidt: 'SingleLineText',
          rqd: true
        },
        {
          column_name: 'segment',
          title: 'Segment',
          uidt: 'SingleLineText',
          rqd: true
        },
        {
          column_name: 'status',
          title: 'Status',
          uidt: 'SingleLineText',
          rqd: true
        },
        {
          column_name: 'institution',
          title: 'Institution',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'role',
          title: 'Role',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'docs',
          title: 'Docs',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'processes',
          title: 'Processes',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'control',
          title: 'Control',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'focus',
          title: 'Focus',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'source',
          title: 'Source',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'email_id',
          title: 'Email ID',
          uidt: 'SingleLineText'
        },
        {
          column_name: 'created_at',
          title: 'Created At',
          uidt: 'DateTime',
          rqd: true
        }
      ]
    };

    const createRes = await api.post(
      `/api/v1/db/meta/projects/${project.id}/tables`,
      tablePayload
    );

    console.log('✅ Таблица quiz_results успешно создана!');
    console.log(`   ID таблицы: ${createRes.data.id}\n`);

    console.log('🎉 Готово! Таблица quiz_results создана и готова к использованию.\n');
    console.log('Структура таблицы:');
    console.log('  - id (ID, автоинкремент)');
    console.log('  - email (текст, обязательное)');
    console.log('  - segment (текст, обязательное)');
    console.log('  - status (текст, обязательное)');
    console.log('  - institution (текст)');
    console.log('  - role (текст)');
    console.log('  - docs (текст)');
    console.log('  - processes (текст)');
    console.log('  - control (текст)');
    console.log('  - focus (текст)');
    console.log('  - source (текст)');
    console.log('  - email_id (текст)');
    console.log('  - created_at (дата/время, обязательное)\n');

  } catch (error) {
    console.error('❌ Ошибка при создании таблицы:');
    if (error.response) {
      console.error(`   Статус: ${error.response.status}`);
      console.error(`   Данные:`, error.response.data);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

// Запуск
createQuizTable();
