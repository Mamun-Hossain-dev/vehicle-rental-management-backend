import { body, type ValidationChain } from 'express-validator';

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('email must be valid')
    .isLength({ max: 254 })
    .normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage('password length must be 8 to 128 characters'),
];
