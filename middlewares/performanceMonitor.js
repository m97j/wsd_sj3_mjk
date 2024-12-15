const performanceMonitor = (req, res, next) => {
    const startTime = process.hrtime(); // 요청 시작 시간 기록
  
    // 응답이 완료되었을 때 실행되는 이벤트 핸들러
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(startTime); // 요청-응답 시간 계산
      const durationInMs = (seconds * 1e9 + nanoseconds) / 1e6; // 밀리초로 변환
  
      // 로그 메시지 생성
      const logMessage = {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration: `${durationInMs.toFixed(2)} ms`,
        timestamp: new Date().toISOString(),
      };
  
      // 콘솔에 로그 출력
      console.log(logMessage);
  
      // 추가로 로그를 파일에 저장하거나, 외부 모니터링 시스템에 전송 가능
      // 예: fs, Winston, 또는 외부 API 호출
    });
  
    next();
  };
  
  module.exports = performanceMonitor;
  