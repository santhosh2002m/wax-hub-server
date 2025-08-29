import Joi from "joi";

export const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const userRegisterSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("ticket_manager", "admin").optional(),
});

export const userTicketSchema = Joi.object({
  vehicle_type: Joi.string().required(),
  guide_name: Joi.string().required(),
  guide_number: Joi.string().optional().allow(""),
  show_name: Joi.string().required(),
  adults: Joi.number().integer().min(0).required(),
  ticket_price: Joi.number().positive().required(),
  tax: Joi.number().min(0).required(),
  total_price: Joi.number().positive().required(),
  final_amount: Joi.number().positive().required(),
});
