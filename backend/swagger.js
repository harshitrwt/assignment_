const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskManager API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/api/v1/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Validation error' }
          }
        }
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Login a user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Login successful' },
            '400': { description: 'Invalid credentials' }
          }
        }
      },
      '/api/v1/tasks': {
        get: {
          summary: 'Get all tasks',
          tags: ['Tasks'],
          responses: {
            '200': { description: 'List of tasks' }
          }
        },
        post: {
          summary: 'Create a task',
          tags: ['Tasks'],
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
                    status: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Task created' },
            '400': { description: 'Validation error' }
          }
        }
      },
      '/api/v1/tasks/{id}': {
        put: {
          summary: 'Update a task',
          tags: ['Tasks'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Task updated' },
            '403': { description: 'Access denied' },
            '404': { description: 'Task not found' }
          }
        },
        delete: {
          summary: 'Delete a task',
          tags: ['Tasks'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            '200': { description: 'Task deleted' },
            '403': { description: 'Access denied' }
          }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
