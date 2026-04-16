const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description:
        'Versioned REST API with JWT authentication, role-based access control, and task CRUD endpoints.'
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Version 1'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Aman Singh' },
            email: { type: 'string', example: 'aman@example.com' },
            password: { type: 'string', example: 'StrongPass123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'aman@example.com' },
            password: { type: 'string', example: 'StrongPass123' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            dueDate: { type: 'string', nullable: true, format: 'date-time' },
            owner: {
              oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/User' }]
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' }
              }
            }
          },
          responses: {
            201: { description: 'User registered successfully' },
            409: { description: 'Email already exists' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: 'Current user profile' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout current user',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: 'Logged out' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get tasks (admin gets all, user gets own)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: 'Task list' }
          }
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create task',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Task created' }
          }
        }
      },
      '/tasks/{taskId}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by id',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'taskId',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Task details' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' }
          }
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update task',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'taskId',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Task updated' }
          }
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'taskId',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Task deleted' }
          }
        }
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Admin: List all users',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: 'User list' },
            403: { description: 'Forbidden' }
          }
        }
      },
      '/users/{userId}/role': {
        patch: {
          tags: ['Users'],
          summary: 'Admin: Update user role',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role'],
                  properties: {
                    role: { type: 'string', enum: ['user', 'admin'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Role updated' },
            403: { description: 'Forbidden' }
          }
        }
      }
    }
  },
  apis: []
};

const spec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
};

module.exports = setupSwagger;
