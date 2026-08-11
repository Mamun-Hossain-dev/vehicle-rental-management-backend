import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { RentalController } from './rental.controller.js';
import {
  createRentalValidation,
  rentalIdValidation,
  rentalListValidation,
  updateRentalIdValidation,
} from './rental.validation.js';

const controller = new RentalController();
export const rentalRouter = Router();
rentalRouter.get(
  '/',
  validate(rentalListValidation),
  asyncHandler(controller.list),
);
rentalRouter.get(
  '/:id',
  validate(rentalIdValidation),
  asyncHandler(controller.get),
);
rentalRouter.post(
  '/',
  validate(createRentalValidation),
  asyncHandler(controller.create),
);
rentalRouter.put(
  '/:id',
  validate(updateRentalIdValidation),
  asyncHandler(controller.update),
);
rentalRouter.delete(
  '/:id',
  validate(rentalIdValidation),
  asyncHandler(controller.delete),
);
