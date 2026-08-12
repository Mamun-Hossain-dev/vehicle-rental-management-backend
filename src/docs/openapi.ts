import type { JsonObject } from 'swagger-ui-express';

const security = [{ bearerAuth: [] }];
const id = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};
const errors = {
  400: { description: 'Validation error' },
  401: { description: 'Missing or invalid JWT' },
  404: { description: 'Resource not found' },
};

export const openApiDocument: JsonObject = {
  openapi: '3.0.3',
  info: {
    title: 'Vehicle Rental Management API',
    version: '1.0.0',
    description:
      'Staff authentication, fleet management, rentals, and monthly reports.',
  },
  servers: [{ url: '/api/v1', description: 'Version 1' }],
  tags: [
    { name: 'Auth' },
    { name: 'Vehicles' },
    { name: 'Rentals' },
    { name: 'Reports' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'staff@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
        },
      },
      LoginResult: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          staff: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['staff'] },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      VehicleInput: {
        type: 'object',
        required: ['name', 'plate_number', 'category', 'daily_rate'],
        properties: {
          name: { type: 'string', example: 'Toyota Axio' },
          plate_number: { type: 'string', example: 'DHAKA-11-1001' },
          category: { type: 'string', example: 'Sedan' },
          daily_rate: { type: 'string', example: '3000.00' },
          photo: { type: 'string', format: 'binary' },
        },
      },
      RentalInput: {
        type: 'object',
        required: [
          'vehicle_id',
          'customer_name',
          'customer_phone',
          'start_date',
          'end_date',
        ],
        properties: {
          vehicle_id: { type: 'integer', minimum: 1, example: 1 },
          customer_name: { type: 'string', example: 'John Doe' },
          customer_phone: { type: 'string', example: '01700000000' },
          start_date: { type: 'string', format: 'date', example: '2026-08-10' },
          end_date: { type: 'string', format: 'date', example: '2026-08-12' },
        },
      },
      RentalUpdate: {
        allOf: [
          { $ref: '#/components/schemas/RentalInput' },
          {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['booked', 'ongoing', 'completed', 'cancelled'],
              },
            },
          },
        ],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { 200: { description: 'API is running' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate staff and issue JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Access token and authenticated staff information',
          },
          400: errors[400],
          401: { description: 'Invalid email or password' },
          429: { description: 'Too many failed login attempts' },
        },
      },
    },
    '/vehicles': {
      get: {
        tags: ['Vehicles'],
        summary: 'List active vehicles',
        security,
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
          },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated vehicle list' },
          401: errors[401],
        },
      },
      post: {
        tags: ['Vehicles'],
        summary: 'Create vehicle',
        security,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/VehicleInput' },
            },
          },
        },
        responses: {
          201: { description: 'Vehicle created' },
          400: errors[400],
          401: errors[401],
          409: { description: 'Plate number already exists' },
        },
      },
    },
    '/vehicles/{id}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get active vehicle',
        security,
        parameters: [id],
        responses: { 200: { description: 'Vehicle detail' }, ...errors },
      },
      put: {
        tags: ['Vehicles'],
        summary: 'Update vehicle or replace photo',
        security,
        parameters: [id],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/VehicleInput' },
            },
          },
        },
        responses: { 200: { description: 'Vehicle updated' }, ...errors },
      },
      delete: {
        tags: ['Vehicles'],
        summary: 'Soft-delete vehicle',
        security,
        parameters: [id],
        responses: { 200: { description: 'Vehicle soft-deleted' }, ...errors },
      },
    },
    '/rentals': {
      get: {
        tags: ['Rentals'],
        summary: 'List and filter rentals',
        security,
        parameters: [
          {
            name: 'vehicle_id',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['booked', 'ongoing', 'completed', 'cancelled'],
            },
          },
          {
            name: 'start_date',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'end_date',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: {
          200: { description: 'Rental list' },
          400: errors[400],
          401: errors[401],
        },
      },
      post: {
        tags: ['Rentals'],
        summary: 'Create rental',
        description:
          'Total amount is calculated server-side. Overlapping active rentals return 409.',
        security,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RentalInput' },
            },
          },
        },
        responses: {
          201: { description: 'Rental created' },
          ...errors,
          409: { description: 'Vehicle unavailable for selected dates' },
        },
      },
    },
    '/rentals/{id}': {
      get: {
        tags: ['Rentals'],
        summary: 'Get rental',
        security,
        parameters: [id],
        responses: { 200: { description: 'Rental detail' }, ...errors },
      },
      put: {
        tags: ['Rentals'],
        summary: 'Update rental and recalculate amount',
        security,
        parameters: [id],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RentalUpdate' },
            },
          },
        },
        responses: {
          200: { description: 'Rental updated' },
          ...errors,
          409: { description: 'Vehicle unavailable for selected dates' },
        },
      },
      delete: {
        tags: ['Rentals'],
        summary: 'Cancel rental',
        security,
        parameters: [id],
        responses: { 200: { description: 'Rental cancelled' }, ...errors },
      },
    },
    '/reports/rentals': {
      get: {
        tags: ['Reports'],
        summary: 'Monthly rental report per vehicle',
        security,
        parameters: [
          {
            name: 'month',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              pattern: '^\\d{4}-(0[1-9]|1[0-2])$',
              example: '2026-08',
            },
          },
          {
            name: 'vehicle_id',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
          },
        ],
        responses: {
          200: { description: 'Monthly report and highest-revenue vehicle' },
          400: errors[400],
          401: errors[401],
        },
      },
    },
  },
};
