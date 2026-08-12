import path from 'node:path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { openApiDocument } from './docs/openapi.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';
import { requireStaff } from './middleware/role.middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { rentalRouter } from './modules/rentals/rental.routes.js';
import { reportRouter } from './modules/reports/report.routes.js';
import { vehicleRouter } from './modules/vehicles/vehicle.routes.js';
import { sendResponse } from './utils/send-response.js';

export const app = express();
app.use(express.json({ limit: '100kb' }));
const api = express.Router();
api.use('/uploads/vehicles', express.static(path.resolve(env.UPLOAD_PATH)));
api.get('/docs/openapi.json', (_req, res) => res.json(openApiDocument));
api.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
api.get('/health', (_req, res) =>
  sendResponse(res, { data: { status: 'ok' } }),
);
api.use('/auth', authRouter);
api.use('/vehicles', authenticate, requireStaff, vehicleRouter);
api.use('/rentals', authenticate, requireStaff, rentalRouter);
api.use('/reports', authenticate, requireStaff, reportRouter);
app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);
