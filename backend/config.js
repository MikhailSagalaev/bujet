require('dotenv').config();

module.exports = {
  // NocoDB Configuration
  nocodb: {
    url: process.env.NOCODB_URL || 'http://localhost:8080',
    token: process.env.NOCODB_TOKEN,
    projectId: process.env.NOCODB_PROJECT_ID,
    tables: {
      users: 'mv805taz8y6rws9',        // Users_Grid_view_csv
      courses: 'mc1fdmzb4zs2om7',      // Курсы_Grid_view_csv
      purchases: 'mkovcnkg9deyy80'     // Покупки_Grid_view_csv
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // CORS Configuration
  cors: {
    origins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
  },

  // Bonus System
  bonuses: {
    purchase: parseInt(process.env.PURCHASE_BONUS) || 300,
    referral: parseInt(process.env.REFERRAL_BONUS) || 100
  }
};
