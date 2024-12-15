const { body, validationResult } = require('express-validator');

// 유효성 검사 규칙 정의
const validationRules = {
  registerUser: [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  loginUser: [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  jobPost: [
    body('title')
      .notEmpty()
      .withMessage('Job title is required')
      .isLength({ min: 3 })
      .withMessage('Job title must be at least 3 characters long'),
    body('company')
      .notEmpty()
      .withMessage('Company name is required'),
    body('location')
      .notEmpty()
      .withMessage('Location is required'),
    body('salary')
      .optional()
      .isNumeric()
      .withMessage('Salary must be a numeric value'),
  ],
};

// 유효성 검사 결과 처리 미들웨어
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation error',
      details: errors.array().map((err) => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};

module.exports = { validationRules, validate };
