import type { RequestHandler } from 'express';
import { ApiError } from '../utils/api-error.js';

export const requireStaff: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== 'staff') {
    return next(new ApiError(403, 'Staff access required'));
  }

  next();
};
