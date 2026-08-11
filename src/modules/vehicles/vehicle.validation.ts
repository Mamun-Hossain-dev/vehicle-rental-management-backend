import Joi from 'joi';

const id = Joi.number().integer().positive().required();
const fields = {
  name: Joi.string().trim().min(2).max(120),
  plate_number: Joi.string().trim().uppercase().min(2).max(30),
  category: Joi.string().trim().min(2).max(50),
  daily_rate: Joi.string()
    .pattern(/^\d{1,10}(?:\.\d{1,2})?$/)
    .custom((value: string, helpers) =>
      Number(value) > 0 ? value : helpers.error('number.positive'),
    )
    .messages({ 'number.positive': 'daily_rate must be greater than zero' }),
};

export const vehicleListSchema = Joi.object({
  body: Joi.object(),
  params: Joi.object(),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().trim().max(50),
    search: Joi.string().trim().max(120),
  }),
});
export const vehicleIdSchema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({ id }),
});
export const createVehicleSchema = Joi.object({
  body: Joi.object({
    name: fields.name.required(),
    plate_number: fields.plate_number.required(),
    category: fields.category.required(),
    daily_rate: fields.daily_rate.required(),
  }),
  query: Joi.object(),
  params: Joi.object(),
});
export const updateVehicleSchema = Joi.object({
  body: Joi.object(fields),
  query: Joi.object(),
  params: Joi.object({ id }),
});
