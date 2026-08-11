import { Router } from 'express';
import { vehiclePhotoUpload } from '../../middleware/upload.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { VehicleController } from './vehicle.controller.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleIdSchema,
  vehicleListSchema,
} from './vehicle.validation.js';

const controller = new VehicleController();
export const vehicleRouter = Router();
vehicleRouter.get(
  '/',
  validate(vehicleListSchema),
  asyncHandler(controller.list),
);
vehicleRouter.get(
  '/:id',
  validate(vehicleIdSchema),
  asyncHandler(controller.get),
);
vehicleRouter.post(
  '/',
  vehiclePhotoUpload.single('photo'),
  validate(createVehicleSchema),
  asyncHandler(controller.create),
);
vehicleRouter.put(
  '/:id',
  vehiclePhotoUpload.single('photo'),
  validate(updateVehicleSchema),
  asyncHandler(controller.update),
);
vehicleRouter.delete(
  '/:id',
  validate(vehicleIdSchema),
  asyncHandler(controller.delete),
);
