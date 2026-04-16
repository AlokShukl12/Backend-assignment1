const { StatusCodes } = require('http-status-codes');
const User = require('./user.model');
const ApiError = require('../../utils/apiError');
const asyncHandler = require('../../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      count: users.length,
      users: users.map((user) => user.toSafeObject())
    }
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You cannot change your own role');
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.role = req.body.role;
  await user.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user: user.toSafeObject()
    }
  });
});

module.exports = {
  getUsers,
  updateUserRole
};
