import Joi from 'joi';

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().max(254).required(),
    password: Joi.string().min(8).max(128).required(),
  }).required(),
  query: Joi.object(),
  params: Joi.object(),
});
