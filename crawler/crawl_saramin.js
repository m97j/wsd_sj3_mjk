const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const schedule = require('node-schedule');
const logger = require('../utils/logger');

// MongoDB 설정
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'job_board';
const collectionName = 'jobs';

// MongoDB 연결
async function connectToMongo() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return client.db(dbName).collection(collectionName);
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
async function crawlPage(collection, keyword, page) {
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
        employmentType,
        deadline,
      };

      jobs.push(job);
    });

    for (const job of jobs) {
      const existing = await collection.findOne({ link: job.link });
      if (!existing) {
        await collection.insertOne(job);
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
  const collection = await connectToMongo();

  for (const keyword of keywords) {
    logger.info(`Crawling keyword: ${keyword}`);
    for (let page = 1; page <= pages; page++) {
      await crawlPage(collection, keyword, page);
    }
  }

  logger.info('Crawling completed for all keywords.');
}

// 스케줄링된 크롤링
function scheduleCrawl(keywords, pages) {
  schedule.scheduleJob('0 0 * * *', async () => {
    logger.info('Starting scheduled crawl...');
    await crawlSaramin(keywords, pages);
  });
}

module.exports = { crawlSaramin, scheduleCrawl };
