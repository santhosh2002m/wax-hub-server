import Joi from "joi";

export const messageSchema = Joi.object({
  phone: Joi.string().optional(),
  phones: Joi.array()
    .items(Joi.string().pattern(/^\+\d{10,15}$/))
    .optional(),
  message: Joi.string().required(),
}).xor("phone", "phones"); // Ensures either phone or phones is provided, but not both
