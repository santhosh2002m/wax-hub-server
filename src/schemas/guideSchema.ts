import Joi from "joi";

export const guideSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.string().optional(),
  vehicle_type: Joi.string().optional(),
  score: Joi.number().integer().optional(),
});
