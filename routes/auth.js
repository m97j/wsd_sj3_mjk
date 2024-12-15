const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 회원가입
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;

    // 중복 회원 검사
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 저장
    const newUser = new User({ email, password: hashedPassword, username: name });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 로그인
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // 사용자 인증
    const user = await User.findOne({ email }).select('+password'); // 비밀번호 포함하여 조회
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // JWT 토큰 발급
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 회원 정보 수정
router.put('/profile', authMiddleware, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, password } = req.body;
    const updates = {};

    if (name) updates.username = name;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
