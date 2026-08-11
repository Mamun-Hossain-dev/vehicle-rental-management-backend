import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { RentalController } from './rental.controller.js';
import {
  createRentalSchema,
  rentalIdSchema,
  rentalListSchema,
  updateRentalSchema,
} from './rental.validation.js';

const controller = new RentalController();
export const rentalRouter = Router();
rentalRouter.get(
  '/',
  validate(rentalListSchema),
  asyncHandler(controller.list),
);
rentalRouter.get(
  '/:id',
  validate(rentalIdSchema),
  asyncHandler(controller.get),
);
rentalRouter.post(
  '/',
  validate(createRentalSchema),
  asyncHandler(controller.create),
);
rentalRouter.put(
  '/:id',
  validate(updateRentalSchema),
  asyncHandler(controller.update),
);
rentalRouter.delete(
  '/:id',
  validate(rentalIdSchema),
  asyncHandler(controller.delete),
);
