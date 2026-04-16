const { z } = require('zod');

const objectIdRegex = /^[a-f\d]{24}$/i;
const emptyObject = z.object({}).passthrough();

const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['user', 'admin'])
  }),
  params: z.object({
    userId: z.string().regex(objectIdRegex, 'Invalid user id')
  }),
  query: emptyObject
});

module.exports = {
  updateUserRoleSchema
};
