const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

// Routes
const widgetRoutes = require('./routes/widget');
const webhookRoutes = require('./routes/webhook');

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origins.length > 0 ? config.cors.origins : '*',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// API Routes
app.use('/api/widget', widgetRoutes);
app.use('/api/webhook', webhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 E-Budget Backend API`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.server.env}`);
  console.log(`🗄️  NocoDB URL: ${config.nocodb.url}`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/widget/courses');
  console.log('  POST /api/widget/referrals');
  console.log('  POST /api/widget/profile');
  console.log('  POST /api/widget/purchases');
  console.log('  POST /api/webhook/tilda');
  console.log('  POST /api/webhook/tilda/signup');
  console.log('='.repeat(50));
});

module.exports = app;
