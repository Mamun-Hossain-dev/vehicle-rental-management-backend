import type { RequestHandler } from 'express';
import type Joi from 'joi';
import { ApiError } from '../utils/api-error.js';

export const validate =
  (schema: Joi.ObjectSchema): RequestHandler =>
  (req, _res, next) => {
    const { error, value } = schema.validate(
      { body: req.body as unknown, query: req.query, params: req.params },
      { abortEarly: false, stripUnknown: true },
    );
    if (error)
      return next(
        new ApiError(
          400,
          error.details.map(({ message }) => message).join(', '),
        ),
      );
    const validated = value as {
      body: unknown;
      query: unknown;
      params: unknown;
    };
    req.body = validated.body;
    req.validatedQuery = validated.query;
    next();
  };
