const fs = require('fs');
const path = require('path');

// 요청 로깅 미들웨어
const requestLogger = (req, res, next) => {
  const logFilePath = path.join(__dirname, '../logs/requests.log'); // 로그 파일 경로

  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
  };

  // 로그 메시지를 JSON으로 변환
  const logMessage = JSON.stringify(logData, null, 2);

  // 콘솔에 로그 출력 (디버깅용)
  console.log(logMessage);

  // 로그 파일에 저장
  fs.appendFile(logFilePath, logMessage + '\n', (err) => {
    if (err) {
      console.error('Failed to write request log:', err);
    }
  });

  next();
};

module.exports = requestLogger;
