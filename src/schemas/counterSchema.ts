// src/schemas/counterSchema.ts
import Joi from "joi";

export const counterSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "manager").optional(), // Allow role with valid values
});
