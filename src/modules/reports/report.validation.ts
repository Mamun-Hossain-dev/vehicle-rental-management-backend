import Joi from 'joi';

export const reportSchema = Joi.object({
  body: Joi.object(),
  params: Joi.object(),
  query: Joi.object({
    month: Joi.string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
      .required(),
    vehicle_id: Joi.number().integer().positive(),
  }),
});
