const { createLogger, format, transports } = require('winston');
const path = require('path');
const Log = require('../models/Log'); 

// 로그 포맷 설정
const loggerFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, metadata, stack }) => {
    if (stack) {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  })
);

// MongoDB 트랜스포트 추가
const MongoDBTransport = {
  log: async (info, callback) => {
    try {
      // Log 모델을 사용해 DB에 로그 저장
      await Log.create({
        level: info.level,
        message: info.message,
        timestamp: new Date(),
        metadata: info.metadata || null,
      });
    } catch (error) {
      console.error('Failed to save log to MongoDB:', error.message);
    }
    callback();
  },
};

// Winston 로거 생성
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // 기본 로그 레벨
  format: loggerFormat,
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), loggerFormat) }), // 콘솔 출력
    new transports.File({ filename: path.join(__dirname, '../logs/app.log') }), // 파일 저장
    MongoDBTransport, // MongoDB 저장
  ],
});

// 유틸리티 함수로 로거 래핑
const log = {
  info: (message, metadata) => logger.info(message, { metadata }),
  warn: (message, metadata) => logger.warn(message, { metadata }),
  error: (message, metadata) => logger.error(message, { metadata }),
  debug: (message, metadata) => logger.debug(message, { metadata }),
  stream: {
    write: (message) => logger.info(message.trim()), // HTTP 요청 로깅용
  },
};

module.exports = log;
