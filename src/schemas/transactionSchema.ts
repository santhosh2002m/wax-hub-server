// src/schemas/transactionSchema.ts
import Joi from "joi";

export const transactionSchema = Joi.object({
  adult_count: Joi.number().integer().min(0).optional(),
  child_count: Joi.number().integer().min(0).optional(),
  category: Joi.string()
    .valid("Adult", "Child", "Senior", "Group", "Other")
    .optional(),
  total_paid: Joi.number().positive().optional(),
  show_name: Joi.string().optional(), // Allow updating show_name via ticket
  date: Joi.date().optional(),
});
