const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String },
  description: { type: String },
  location: { type: String }, // 회사 위치
  established: { type: Date }, // 설립일
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', CompanySchema);
