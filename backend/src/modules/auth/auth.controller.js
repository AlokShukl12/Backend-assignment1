const { StatusCodes } = require('http-status-codes');
const User = require('../users/user.model');
const ApiError = require('../../utils/apiError');
const asyncHandler = require('../../utils/asyncHandler');
const { signAccessToken, attachAuthCookie, clearAuthCookie } = require('./auth.utils');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email is already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful. Please login.',
    data: {
      user: user.toSafeObject()
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = signAccessToken(user._id, user.role);
  attachAuthCookie(res, token);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toSafeObject(),
      token
    }
  });
});

const me = asyncHandler(async (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user: req.user.toSafeObject()
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  register,
  login,
  me,
  logout
};
