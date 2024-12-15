const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
