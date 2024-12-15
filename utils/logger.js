const { createLogger, format, transports } = require('winston');
const path = require('path');

// 로그 파일 경로
const logFilePath = path.join(__dirname, '../logs/app.log');

// 로그 포맷 설정
const loggerFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      // 에러의 스택 트레이스가 포함된 경우
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  })
);

// Winston 로거 생성
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // 기본 로그 레벨: info
  format: loggerFormat,
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), loggerFormat) }), // 콘솔 출력
    new transports.File({ filename: logFilePath }), // 파일 저장
  ],
});

// 유틸리티 함수로 로거 래핑
const log = {
  info: (message) => logger.info(message),
  warn: (message) => logger.warn(message),
  error: (message) => logger.error(message),
  debug: (message) => logger.debug(message),
  stream: {
    write: (message) => logger.info(message.trim()), // HTTP 요청 로깅용
  },
};

module.exports = log;
