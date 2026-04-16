const { z } = require('zod');

const emptyObject = z.object({}).passthrough();

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must include at least one uppercase, one lowercase, and one number'
      })
  }),
  params: emptyObject,
  query: emptyObject
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1)
  }),
  params: emptyObject,
  query: emptyObject
});

module.exports = {
  registerSchema,
  loginSchema
};
