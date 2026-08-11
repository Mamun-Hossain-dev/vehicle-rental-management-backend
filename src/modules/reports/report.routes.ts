import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { ReportController } from './report.controller.js';
import { reportValidation } from './report.validation.js';

const controller = new ReportController();
export const reportRouter = Router();
reportRouter.get(
  '/rentals',
  validate(reportValidation),
  asyncHandler(controller.monthly),
);
