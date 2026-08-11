import Joi from 'joi';

const id = Joi.number().integer().positive().required();
const date = Joi.string()
  .isoDate()
  .pattern(/^\d{4}-\d{2}-\d{2}$/);
const status = Joi.string().valid(
  'booked',
  'ongoing',
  'completed',
  'cancelled',
);
const fields = {
  vehicle_id: Joi.number().integer().positive(),
  customer_name: Joi.string().trim().min(2).max(120),
  customer_phone: Joi.string().trim().min(5).max(30),
  start_date: date,
  end_date: date,
};

const dateOrder = (
  value: { start_date?: string; end_date?: string },
  helpers: Joi.CustomHelpers,
) =>
  value.start_date && value.end_date && value.start_date > value.end_date
    ? helpers.error('date.order')
    : value;

export const rentalListSchema = Joi.object({
  body: Joi.object(),
  params: Joi.object(),
  query: Joi.object({
    vehicle_id: fields.vehicle_id,
    status,
    start_date: date,
    end_date: date,
  })
    .custom(dateOrder)
    .messages({ 'date.order': 'start_date must not be after end_date' }),
});
export const rentalIdSchema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({ id }),
});
export const createRentalSchema = Joi.object({
  body: Joi.object({
    vehicle_id: fields.vehicle_id.required(),
    customer_name: fields.customer_name.required(),
    customer_phone: fields.customer_phone.required(),
    start_date: fields.start_date.required(),
    end_date: fields.end_date.required(),
  })
    .custom(dateOrder)
    .messages({ 'date.order': 'start_date must not be after end_date' }),
  query: Joi.object(),
  params: Joi.object(),
});
export const updateRentalSchema = Joi.object({
  body: Joi.object({ ...fields, status }).min(1),
  query: Joi.object(),
  params: Joi.object({ id }),
});
