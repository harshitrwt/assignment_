const swaggerJsdoc = require('swagger-jsdoc');

const taskSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'Finish backend assignment' },
    description: { type: 'string', example: 'Complete validation, Swagger, and README.' },
    status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'], example: 'Pending' },
    userId: { type: 'integer', example: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Validation error message' },
  },
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Void API',
      version: '1.0.0',
      description: 'Versioned REST API for JWT authentication and task CRUD with user/admin roles.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: errorSchema,
        Task: taskSchema,
        AuthRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 64, example: 'harry@gmail.com' },
            password: { type: 'string', minLength: 6, maxLength: 128, example: 'secret123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expiresIn: { type: 'string', example: '1h' },
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'harry@gmail.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          },
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', maxLength: 120, example: 'Read API checklist' },
            description: { type: 'string', maxLength: 2000, example: 'Verify CRUD and auth requirements.' },
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
          },
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 120 },
            description: { type: 'string', maxLength: 2000 },
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'] },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          tags: ['System'],
          responses: {
            '200': { description: 'API is running' },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthRequest' },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '409': { description: 'User already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Login and receive a JWT',
          tags: ['Auth'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/tasks': {
        get: {
          summary: 'List tasks',
          description: 'Users receive their own tasks. Admins receive all tasks with owner metadata.',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of tasks',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                },
              },
            },
            '401': { description: 'Missing or invalid JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        post: {
          summary: 'Create a task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskCreateRequest' },
              },
            },
          },
          responses: {
            '201': { description: 'Task created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Missing or invalid JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/tasks/{id}': {
        put: {
          summary: 'Update a task',
          description: 'Owners can edit title, description, and status. Admins can change status on all tasks, but can edit content only on their own tasks.',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskUpdateRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Task updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Missing or invalid JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '404': { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          summary: 'Delete a task',
          description: 'Users can delete their own tasks. Admins can delete any task.',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Task deleted' },
            '401': { description: 'Missing or invalid JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Access denied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '404': { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
