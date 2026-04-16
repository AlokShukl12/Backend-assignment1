const jwt = require('jsonwebtoken');
const env = require('../../config/env');

const parseExpiryToMs = (value) => {
  if (!value || typeof value !== 'string') return 24 * 60 * 60 * 1000;
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) return 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitMap = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * unitMap[unit];
};

const signAccessToken = (userId, role) => {
  return jwt.sign(
    {
      role
    },
    env.jwtSecret,
    {
      subject: String(userId),
      expiresIn: env.jwtExpiresIn
    }
  );
};

const attachAuthCookie = (res, token) => {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: parseExpiryToMs(env.jwtExpiresIn)
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax'
  });
};

module.exports = {
  signAccessToken,
  attachAuthCookie,
  clearAuthCookie
};
