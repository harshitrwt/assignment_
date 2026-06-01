const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Primetrade Assignment API',
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
      '/api/auth/register': {
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
                    password: { type: 'string' },
                    role: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'User already exists' }
          }
        }
      },
      '/api/auth/login': {
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
      '/api/products': {
        get: {
          summary: 'Get all products',
          tags: ['Products'],
          responses: {
            '200': { description: 'List of products' }
          }
        },
        post: {
          summary: 'Create a product (Admin only)',
          tags: ['Products'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'description', 'price'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Product created' },
            '403': { description: 'Access denied' }
          }
        }
      },
      '/api/products/{id}': {
        get: {
          summary: 'Get product by ID',
          tags: ['Products'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            '200': { description: 'Product data' },
            '404': { description: 'Product not found' }
          }
        },
        put: {
          summary: 'Update a product (Admin only)',
          tags: ['Products'],
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
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Product updated' }
          }
        },
        delete: {
          summary: 'Delete a product (Admin only)',
          tags: ['Products'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            '200': { description: 'Product deleted' }
          }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
