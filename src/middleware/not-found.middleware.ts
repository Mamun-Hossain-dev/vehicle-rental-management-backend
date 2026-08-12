import type { RequestHandler } from 'express';
import { sendResponse } from '../utils/send-response.js';

export const notFound: RequestHandler = (_req, res) => {
  sendResponse(res, {
    success: false,
    status: 404,
    message: 'Route not found',
  });
};
