/**
 * OpenAPI 3 documentation.
 *
 * Base spec (info, servers, security schemes, reusable schema components) is
 * defined inline; per-endpoint details come from JSDoc `@openapi` annotations
 * in the route files scanned below. The UI is served at `/api/docs`.
 */

import { join } from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@/config';

export const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Lumora Services API (v1)',
      version: '1.0.0',
      description:
        'Backend API for the Lumora creative marketplace. All endpoints are served under `/api/v1`; ' +
        'authentication uses a Bearer access token with refresh-token rotation.',
      contact: { name: 'Lumora Services' },
    },
    servers: [{ url: '/api/v1', description: `Current API version (${env.nodeEnv})` }],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Health: {
          type: 'object',
          required: ['status', 'uptime', 'timestamp'],
          properties: {
            status: { type: 'string', enum: ['ok'] },
            uptime: { type: 'number', description: 'Process uptime in seconds.' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: {
              type: 'object',
              required: ['code', 'message'],
              properties: {
                code: { type: 'string', example: 'NOT_FOUND' },
                message: { type: 'string' },
                details: { description: 'Optional structured context.' },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: { type: 'boolean', enum: [false] },
            error: {
              type: 'object',
              required: ['code', 'message', 'fields'],
              properties: {
                code: { type: 'string', enum: ['VALIDATION_ERROR'] },
                message: { type: 'string' },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['path', 'message'],
                    properties: {
                      path: { type: 'string', example: 'body.email' },
                      message: { type: 'string' },
                      code: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [join(__dirname, 'routes/**/*.routes.ts'), join(__dirname, 'routes/**/*.routes.js')],
});
