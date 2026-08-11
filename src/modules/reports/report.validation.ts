import { query, type ValidationChain } from 'express-validator';

export const reportValidation: ValidationChain[] = [
  query('month')
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage('month must use YYYY-MM'),
  query('vehicle_id').optional().isInt({ min: 1 }).toInt(),
];
