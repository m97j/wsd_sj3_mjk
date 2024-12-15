const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 사용자 스키마 정의
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // 앞뒤 공백 제거
    minlength: 3, // 최소 길이
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'], // 이메일 유효성 검사
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // 최소 길이
    select: false, // 기본적으로 쿼리에 포함하지 않음
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 비밀번호 해시화 (회원가입 및 비밀번호 변경 시)
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// 비밀번호 검증 메서드
UserSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// 사용자 스키마의 모델 생성 및 내보내기
module.exports = mongoose.model('User', UserSchema);
