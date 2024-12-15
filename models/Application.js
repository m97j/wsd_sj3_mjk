const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // 지원한 공고 참조
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 지원자 참조
  resume: { type: String }, // 이력서 링크
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // 상태
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
