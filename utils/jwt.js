const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

const JWT_SECRET = process.env.JWT_SECRET || constants.JWT_SECRET;
const JWT_EXPIRATION = constants.JWT_EXPIRATION;

/**
 * JWT 토큰 생성
 * @param {Object} payload - 토큰에 포함할 데이터
 * @returns {string} - 생성된 JWT 토큰
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * JWT 토큰 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} - 검증된 페이로드 데이터
 * @throws {Error} - 검증 실패 시 에러 발생
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error; // 호출자에게 에러 전달
  }
};

/**
 * JWT 토큰 재발급
 * @param {Object} payload - 토큰에 포함할 데이터
 * @returns {string} - 재발급된 JWT 토큰
 */
const refreshToken = (payload) => {
  return generateToken(payload);
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken,
};
