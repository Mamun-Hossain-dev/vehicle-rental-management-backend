import { unlink } from 'node:fs/promises';
import path from 'node:path';
import type { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

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
    res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }
  if (error instanceof multer.MulterError) {
    res.status(400).json({ success: false, message: error.message });
    return;
  }
  if (error.code === '23505') {
    res.status(409).json({
      success: false,
      message: 'A record with that unique value exists',
    });
    return;
  }
  if (env.NODE_ENV !== 'test') console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
