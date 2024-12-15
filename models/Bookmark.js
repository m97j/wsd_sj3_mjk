const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  createdAt: { type: Date, default: Date.now },
});

// 중복 방지를 위한 복합 인덱스
BookmarkSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
