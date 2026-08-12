import type { Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import type { ApiResponse } from '../types/api.js';
import { sendResponse } from '../utils/send-response.js';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res: Response<ApiResponse>) => {
    sendResponse(res, {
      success: false,
      status: 429,
      message: 'Too many failed login attempts. Try again later',
    });
  },
});
