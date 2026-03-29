require('dotenv').config();

module.exports = {
  // NocoDB Configuration
  nocodb: {
    url: process.env.NOCODB_URL || 'http://localhost:8080',
    token: process.env.NOCODB_TOKEN,
    projectId: process.env.NOCODB_PROJECT_ID,
    tables: {
      users: 'mc23d0yamksjtys',        // Users (created by setup script)
      courses: 'myj1um1tommd7s6',      // Courses (created by setup script)
      purchases: 'msf2dwart0cicac'     // Purchases (created by setup script)
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
