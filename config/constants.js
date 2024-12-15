module.exports = {
    // 애플리케이션 정보
    APP_NAME: 'Job Board API',
    APP_VERSION: '1.0.0',
  
    // 환경설정
    PORT: process.env.PORT || 18233,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://113.198.66.67:18233/job_board',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    JWT_EXPIRATION: '1h', // JWT 만료 시간
  
    // 기본 페이징 설정
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_SIZE: 20,
      MAX_SIZE: 100,
    },
  
    // 경로 설정
    LOGS_DIR: './logs', // 로그 파일 디렉토리
    UPLOADS_DIR: './uploads', // 업로드 파일 디렉토리
  
    // 응답 메시지
    RESPONSE_MESSAGES: {
      SUCCESS: 'Operation successful',
      NOT_FOUND: 'Resource not found',
      VALIDATION_ERROR: 'Validation error',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Forbidden access',
      INTERNAL_ERROR: 'Internal server error',
      DUPLICATE_ERROR: 'Resource already exists',
    },
  
    // 기타 설정
    API_RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15분
      MAX_REQUESTS: 100, // 15분 동안 최대 요청 수
    },
  };
  