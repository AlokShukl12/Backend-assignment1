const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema
} = require('./task.validation');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('./task.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:taskId', validate(taskIdParamSchema), getTaskById);
router.patch('/:taskId', validate(updateTaskSchema), updateTask);
router.delete('/:taskId', validate(taskIdParamSchema), deleteTask);

module.exports = router;
