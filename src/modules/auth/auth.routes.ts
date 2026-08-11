import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { AuthController } from './auth.controller.js';
import { loginSchema } from './auth.validation.js';

const controller = new AuthController();
export const authRouter = Router();
authRouter.post(
  '/login',
  validate(loginSchema),
  asyncHandler(controller.login),
);
