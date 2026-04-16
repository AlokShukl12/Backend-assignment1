const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const allowRoles = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const { getUsers, updateUserRole } = require('./user.controller');
const { updateUserRoleSchema } = require('./user.validation');

const router = express.Router();

router.use(authMiddleware, allowRoles('admin'));
router.get('/', getUsers);
router.patch('/:userId/role', validate(updateUserRoleSchema), updateUserRole);

module.exports = router;
