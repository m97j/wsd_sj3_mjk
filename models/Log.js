const mongoose = require('mongoose');

// Capped Collection에 맞는 Log 스키마
const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ['info', 'error', 'warn'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object },
});

// 이미 생성된 'logs' 컬렉션과 연결
module.exports = mongoose.model('Log', LogSchema, 'logs');
