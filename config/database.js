const mongoose = require('mongoose');
const constants = require('./constants');

// MongoDB 연결 설정 함수
const connectDatabase = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(constants.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 서버 선택 타임아웃 (30초)
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    // 재시도 로직: 연결 실패 시 종료
    process.exit(1);
  }
};

// MongoDB 연결 해제 이벤트
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost. Retrying...');
});

module.exports = connectDatabase;
