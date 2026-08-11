import { body, param, query, type ValidationChain } from 'express-validator';

const statuses = ['booked', 'ongoing', 'completed', 'cancelled'];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const id = () =>
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer')
    .toInt();
const vehicleId = () =>
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('vehicle_id must be a positive integer')
    .toInt();
const customerName = () =>
  body('customer_name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('customer_name length must be 2 to 120 characters');
const customerPhone = () =>
  body('customer_phone')
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage('customer_phone length must be 5 to 30 characters');
const startDate = () =>
  body('start_date')
    .matches(datePattern)
    .withMessage('start_date must use YYYY-MM-DD')
    .isISO8601({ strict: true })
    .withMessage('start_date must be valid');
const endDate = () =>
  body('end_date')
    .matches(datePattern)
    .withMessage('end_date must use YYYY-MM-DD')
    .isISO8601({ strict: true })
    .withMessage('end_date must be valid');
const endAfterStart = () =>
  body('end_date').custom((end: string, { req }) => {
    const start = req.body.start_date as unknown;
    if (typeof start === 'string' && end < start) {
      throw new Error('start_date must not be after end_date');
    }
    return true;
  });

export const rentalListValidation: ValidationChain[] = [
  query('vehicle_id').optional().isInt({ min: 1 }).toInt(),
  query('status').optional().isIn(statuses),
  query('start_date')
    .optional()
    .matches(datePattern)
    .isISO8601({ strict: true }),
  query('end_date')
    .optional()
    .matches(datePattern)
    .isISO8601({ strict: true })
    .custom((end: string, { req }) => {
      const start = req.query?.start_date;
      if (typeof start === 'string' && end < start) {
        throw new Error('start_date must not be after end_date');
      }
      return true;
    }),
];
export const rentalIdValidation: ValidationChain[] = [id()];
export const createRentalValidation: ValidationChain[] = [
  vehicleId(),
  customerName(),
  customerPhone(),
  startDate(),
  endDate(),
  endAfterStart(),
];
export const updateRentalIdValidation: ValidationChain[] = [
  id(),
  vehicleId().optional(),
  customerName().optional(),
  customerPhone().optional(),
  startDate().optional(),
  endDate().optional(),
  endAfterStart().optional(),
  body('status').optional().isIn(statuses),
];
