const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const User = require('../modules/users/user.model');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return req.cookies?.[env.cookieName] || null;
};

const authMiddleware = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid authentication token'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

module.exports = authMiddleware;
