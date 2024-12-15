const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDatabase = require('./config/database');
const logger = require('./utils/logger');
const { crawlSaramin } = require('./crawler/crawl_saramin'); // 크롤링 함수 추가
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const performanceMonitor = require('./middlewares/performanceMonitor');
const swaggerSetup = require('./swagger');

// Import routes
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const bookmarkRoutes = require('./routes/bookmarks');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(performanceMonitor);

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Swagger setup
swaggerSetup(app);

// Health Check
app.get('/', (req, res) => {
  res.send('Job Board API is running!');
});

// 최초 1회 크롤링 실행
(async () => {
  try {
    logger.info('Starting initial web crawling...');
    await crawlSaramin(['python', 'java', 'javascript'], 5);
    logger.info('Initial crawling completed successfully!');
  } catch (error) {
    logger.error(`Initial crawling failed: ${error.message}`);
  }
})();

// Handle undefined routes
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
});
