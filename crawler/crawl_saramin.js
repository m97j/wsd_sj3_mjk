const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');
const connectDatabase = require('../config/database'); 
const Job = require('../models/Job'); 

// IP 차단 여부 확인
async function isBlockedBySaramin() {
  const testUrl = 'https://www.saramin.co.kr/zf_user/search/recruit';

  try {
    const response = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    });

    if (response.status === 200) {
      return false; // 정상 접근 가능
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      logger.error('IP is blocked by Saramin.');
      return true; // 차단됨
    }

    logger.error(`Failed to check IP status: ${error.message}`);
    throw error;
  }
  return false;
}

// HTML 페이지 가져오기
async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch page: ${url} | Error: ${error.message}`);
    throw error;
  }
}

// 크롤링 및 MongoDB 저장
async function crawlPage(keyword, page) {
  const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${keyword}&recruitPage=${page}`;
  logger.info(`Fetching URL: ${url}`);

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    const jobs = [];

    $('.item_recruit').each((_, element) => {
      const title = $(element).find('.job_tit a').text().trim();
      const company = $(element).find('.corp_name a').text().trim();
      const link = 'https://www.saramin.co.kr' + $(element).find('.job_tit a').attr('href');
      const conditions = $(element).find('.job_condition span');
      const location = $(conditions[0]).text().trim() || '';
      const experience = $(conditions[1]).text().trim() || '';
      const education = $(conditions[2]).text().trim() || '';
      const employmentType = $(conditions[3]).text().trim() || '';
      const deadline = $(element).find('.job_date .date').text().trim();

      const job = {
        title,
        company,
        link,
        location,
        experience,
        education,
        employment_type: employmentType,
        deadline: deadline ? new Date(deadline) : null,
      };

      jobs.push(job);
    });

    for (const job of jobs) {
      const existing = await Job.findOne({ link: job.link });
      if (!existing) {
        await Job.create(job);
        logger.info(`Inserted job: ${job.title}`);
      } else {
        logger.info(`Job already exists: ${job.title}`);
      }
    }
  } catch (error) {
    logger.error(`Failed to crawl page ${page} for keyword ${keyword}: ${error.message}`);
  }
}

// 여러 키워드 및 페이지 크롤링
async function crawlSaramin(keywords, pages = 10) {
  try {
    const isBlocked = await isBlockedBySaramin();

    if (isBlocked) {
      logger.error('Crawling aborted: IP is blocked.');
      return; // 차단된 경우 함수 종료
    }

    await connectDatabase(); // 데이터베이스 연결

    for (const keyword of keywords) {
      logger.info(`Crawling keyword: ${keyword}`);
      for (let page = 1; page <= pages; page++) {
        await crawlPage(keyword, page);
      }
    }

    logger.info('Crawling completed for all keywords.');
  } catch (error) {
    logger.error(`Crawling failed: ${error.message}`);
  }
}

module.exports = { crawlSaramin };
