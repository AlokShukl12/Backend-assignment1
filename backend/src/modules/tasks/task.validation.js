const { z } = require('zod');

const objectIdRegex = /^[a-f\d]{24}$/i;
const emptyObject = z.object({}).passthrough();

const dueDateSchema = z.preprocess((value) => {
  if (value === '' || value === undefined) return undefined;
  if (value === null) return null;
  return value;
}, z.coerce.date().nullable().optional());

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().max(1000).optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    dueDate: dueDateSchema
  }),
  params: emptyObject,
  query: emptyObject
});

const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(2).max(120).optional(),
      description: z.string().trim().max(1000).optional(),
      status: z.enum(['todo', 'in-progress', 'done']).optional(),
      dueDate: dueDateSchema
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field must be updated'
    }),
  params: z.object({
    taskId: z.string().regex(objectIdRegex, 'Invalid task id')
  }),
  query: emptyObject
});

const taskIdParamSchema = z.object({
  body: emptyObject,
  params: z.object({
    taskId: z.string().regex(objectIdRegex, 'Invalid task id')
  }),
  query: emptyObject
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema
};
