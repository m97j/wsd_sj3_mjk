const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // 회사 정보 참조
  title: { type: String, required: true },
  link: { type: String, unique: true }, // 중복 방지
  location: { type: String, required: true },
  experience: { type: String },
  education: { type: String },
  employment_type: { type: String }, // 고용 형태 (예: 정규직, 계약직 등)
  deadline: { type: Date },
  sector: { type: String }, // 분야
  salary: { type: String }, // 급여
  createdAt: { type: Date, default: Date.now }, // 생성 시간
  updatedAt: { type: Date, default: Date.now },
});

// 인덱스 설정 (Optional, 탐색 최적화)
JobSchema.index({ title: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ sector: 1 });

module.exports = mongoose.model('Job', JobSchema);
