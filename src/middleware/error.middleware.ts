import { unlink } from 'node:fs/promises';
import path from 'node:path';
import type { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { sendResponse } from '../utils/send-response.js';

interface DatabaseError extends Error {
  code?: string;
}

export const errorHandler: ErrorRequestHandler = (
  error: DatabaseError,
  req,
  res,
  _next,
) => {
  if (req.file) {
    void unlink(
      path.join(
        path.resolve(env.UPLOAD_PATH),
        path.basename(req.file.filename),
      ),
    ).catch(() => undefined);
  }
  if (error instanceof ApiError) {
    sendResponse(res, {
      success: false,
      status: error.statusCode,
      message: error.message,
    });
    return;
  }
  if (error instanceof multer.MulterError) {
    sendResponse(res, {
      success: false,
      status: 400,
      message: error.message,
    });
    return;
  }
  if (error.code === '23505') {
    sendResponse(res, {
      success: false,
      status: 409,
      message: 'A record with that unique value exists',
    });
    return;
  }
  if (env.NODE_ENV !== 'test') console.error(error);
  sendResponse(res, {
    success: false,
    status: 500,
    message: 'Internal server error',
  });
};
