const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 채용 공고 목록 조회 (페이지네이션, 필터링, 검색, 정렬)
router.get('/', async (req, res) => {
  try {
    const { page = 1, size = 20, keyword, location, experience, salary, tech } = req.query;

    const filters = {};
    if (keyword) filters.$or = [{ title: new RegExp(keyword, 'i') }, { company: new RegExp(keyword, 'i') }];
    if (location) filters.location = location;
    if (experience) filters.experience = experience;
    if (salary) filters.salary = { $gte: parseInt(salary) };
    if (tech) filters.techStack = { $in: tech.split(',') };

    const totalItems = await Job.countDocuments(filters);
    const jobs = await Job.find(filters)
      .skip((page - 1) * size)
      .limit(parseInt(size))
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Jobs retrieved successfully',
      data: jobs,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / size),
        currentPage: parseInt(page),
        pageSize: parseInt(size),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 채용 공고 등록
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('experience').notEmpty().withMessage('Experience is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const job = new Job(req.body);
      await job.save();
      res.status(201).json({ message: 'Job created successfully', data: job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 채용 공고 수정
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('company').optional().notEmpty().withMessage('Company cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.status(200).json({ message: 'Job updated successfully', data: updatedJob });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 채용 공고 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
