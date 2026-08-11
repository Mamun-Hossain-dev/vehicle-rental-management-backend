import type { RequestHandler } from 'express';
import { ApiError } from '../utils/api-error.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticate: RequestHandler = (req, _res, next) => {
  const [scheme, token] = req.header('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token)
    return next(new ApiError(401, 'Authentication required'));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
