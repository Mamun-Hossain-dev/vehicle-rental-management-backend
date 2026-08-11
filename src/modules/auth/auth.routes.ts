import { Router } from 'express';
import { loginRateLimit } from '../../middleware/login-rate-limit.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { AuthController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const controller = new AuthController();
export const authRouter = Router();
authRouter.post(
  '/login',
  loginRateLimit,
  validate(loginSchema),
  asyncHandler(controller.login),
);
authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(controller.register),
);
