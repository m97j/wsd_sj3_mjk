const express = require('express');
const logger = require('../utils/logger');
const { runCrawler } = require('../crawler/crawl_saramin.js');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 크롤링 트리거 API
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { keyword, pages } = req.body;

    if (!keyword || !pages) {
      return res.status(400).json({ error: 'Keyword and pages are required' });
    }

    await runCrawler(keyword, pages);
    res.status(200).json({ message: 'Crawling started successfully' });
  } catch (error) {
    logger.error('Crawling error:', error);
    res.status(500).json({ error: 'Failed to start crawling' });
  }
});

module.exports = router;
