import { body, param, query, type ValidationChain } from 'express-validator';

const id = () =>
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer')
    .toInt();
const name = () =>
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('name length must be 2 to 120 characters');
const plateNumber = () =>
  body('plate_number')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('plate_number length must be 2 to 30 characters')
    .toUpperCase();
const category = () =>
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('category length must be 2 to 50 characters');
const dailyRate = () =>
  body('daily_rate')
    .matches(/^\d{1,10}(?:\.\d{1,2})?$/)
    .withMessage(
      'daily_rate must be a positive amount with at most 2 decimal places',
    )
    .custom((value: string) => Number(value) > 0);

export const vehicleListValidation: ValidationChain[] = [
  query('page').default(1).isInt({ min: 1 }).toInt(),
  query('limit').default(10).isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().trim().isLength({ max: 50 }),
  query('search').optional().trim().isLength({ max: 120 }),
];
export const vehicleIdValidation: ValidationChain[] = [id()];
export const createVehicleValidation: ValidationChain[] = [
  name(),
  plateNumber(),
  category(),
  dailyRate(),
];
export const updateVehicleIdValidation: ValidationChain[] = [
  id(),
  name().optional(),
  plateNumber().optional(),
  category().optional(),
  dailyRate().optional(),
];
