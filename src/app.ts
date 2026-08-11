import path from 'node:path';
import express from 'express';
import { env } from './config/env.js';
import { authenticate } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { rentalRouter } from './modules/rentals/rental.routes.js';
import { reportRouter } from './modules/reports/report.routes.js';
import { vehicleRouter } from './modules/vehicles/vehicle.routes.js';

export const app = express();
app.use(express.json({ limit: '100kb' }));
app.use('/uploads/vehicles', express.static(path.resolve(env.UPLOAD_PATH)));
app.get('/health', (_req, res) =>
  res.json({ success: true, data: { status: 'ok' } }),
);
app.use('/auth', authRouter);
app.use('/vehicles', authenticate, vehicleRouter);
app.use('/rentals', authenticate, rentalRouter);
app.use('/reports', authenticate, reportRouter);
app.use(notFound);
app.use(errorHandler);
