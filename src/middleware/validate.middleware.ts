import type { RequestHandler } from 'express';
import { matchedData, validationResult, type ValidationChain } from 'express-validator';
import { ApiError } from '../utils/api-error.js';

export const validate = (rules: ValidationChain[]): RequestHandler[] => [
  ...rules,
  (req, _res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new ApiError(400, result.array().map(({ msg }) => String(msg)).join(', ')));
    }
    req.body = matchedData(req, { locations: ['body'] });
    req.query = matchedData(req, { locations: ['query'] });
    req.params = matchedData(req, { locations: ['params'] });
    next();
  },
];
