const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('jobId').notEmpty().withMessage('Job ID is required'),
    body('resume').notEmpty().withMessage('Resume is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { jobId, resume } = req.body;

      // 중복 지원 체크
      const existingApplication = await Application.findOne({ jobId, userId: req.user.id });
      if (existingApplication) {
        return res.status(400).json({ error: 'You have already applied for this job' });
      }

      // 새로운 지원 내역 생성
      const application = new Application({
        jobId,
        userId: req.user.id,
        resume,
      });
      await application.save();

      res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/', authMiddleware, async (req, res) => {
  try {
    // 사용자의 지원 내역 조회
    const applications = await Application.find({ userId: req.user.id }).populate('jobId'); // Job 데이터 포함
    res.status(200).json({ message: 'Applications retrieved successfully', applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
