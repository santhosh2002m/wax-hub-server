import Joi from "joi";

export const userGuideSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  vehicle_type: Joi.string()
    .valid("guide", "big car", "tt", "car", "auto")
    .required(),
  score: Joi.number().integer().min(0).optional(),
  total_bookings: Joi.number().integer().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});

export const userGuideUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  vehicle_type: Joi.string()
    .valid("guide", "big car", "tt", "car", "auto")
    .optional(),
  score: Joi.number().integer().min(0).optional(),
  total_bookings: Joi.number().integer().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});
