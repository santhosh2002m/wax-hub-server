import Joi from "joi";

export const ticketSchema = Joi.object({
  price: Joi.number().integer().positive().required(),
  ticket_type: Joi.string().optional(),
  show_name: Joi.string().optional(),
  category: Joi.string()
    .valid("Adult", "Child", "Senior", "Group", "Other")
    .default("Other")
    .required(),
});
