const express = require('express');
const { body, validationResult } = require('express-validator');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 북마크 추가/제거
router.post(
  '/',
  authMiddleware,
  [body('jobId').notEmpty().withMessage('Job ID is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { jobId } = req.body;

      const existingBookmark = await Bookmark.findOne({ jobId, userId: req.user.id });
      if (existingBookmark) {
        // 북마크 제거
        await Bookmark.deleteOne({ _id: existingBookmark._id });
        return res.status(200).json({ message: 'Bookmark removed successfully' });
      }

      // 북마크 추가
      const bookmark = new Bookmark({
        jobId,
        userId: req.user.id,
      });
      await bookmark.save();

      res.status(201).json({
        message: 'Bookmark added successfully',
        bookmark,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 북마크 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 북마크 목록 조회 및 Job 데이터 포함
    const bookmarks = await Bookmark.find({ userId: req.user.id }).populate('jobId');
    res.status(200).json({
      message: 'Bookmarks retrieved successfully',
      bookmarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
