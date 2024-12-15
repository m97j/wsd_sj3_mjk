const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ['info', 'error', 'warn'], required: true }, // 로그 레벨
  message: { type: String, required: true }, // 로그 메시지
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object }, // 추가 데이터 (Optional)
});

module.exports = mongoose.model('Log', LogSchema);
