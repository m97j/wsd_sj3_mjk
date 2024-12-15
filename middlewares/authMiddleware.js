const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/error');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (err.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(err);
    }
  }
};

module.exports = authMiddleware;
