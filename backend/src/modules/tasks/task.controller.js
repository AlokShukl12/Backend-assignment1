const { StatusCodes } = require('http-status-codes');
const Task = require('./task.model');
const ApiError = require('../../utils/apiError');
const asyncHandler = require('../../utils/asyncHandler');

const canAccessTask = (user, task) => {
  if (user.role === 'admin') return true;
  const ownerId = task.owner?._id || task.owner;
  return String(ownerId) === String(user._id);
};

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    owner: req.user._id
  });

  const populatedTask = await task.populate('owner', 'name email role');

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task: populatedTask
    }
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .populate('owner', 'name email role');

  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      count: tasks.length,
      tasks
    }
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('owner', 'name email role');
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to access this task');
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      task
    }
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to update this task');
  }

  Object.assign(task, req.body);
  await task.save();

  const populatedTask = await task.populate('owner', 'name email role');

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task: populatedTask
    }
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this task');
  }

  await task.deleteOne();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
