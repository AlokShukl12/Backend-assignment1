const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/apiError');

const allowRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to perform this action'));
  }

  return next();
};

module.exports = allowRoles;
