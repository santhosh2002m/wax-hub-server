"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkMessageSchema = exports.messageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.messageSchema = joi_1.default.object({
    to: joi_1.default.string()
        .pattern(/^(\+[1-9]\d{1,14}|whatsapp:\+\d{1,15})$/)
        .required()
        .messages({
        "string.pattern.base": "Phone number must be in E.164 format (e.g., +1234567890) or WhatsApp format (e.g., whatsapp:+1234567890)",
        "any.required": "Recipient phone number is required",
    }),
    body: joi_1.default.string().min(1).max(1600).required().messages({
        "string.empty": "Message body cannot be empty",
        "string.max": "Message cannot exceed 1600 characters",
        "any.required": "Message body is required",
    }),
});
exports.bulkMessageSchema = joi_1.default.object({
    recipients: joi_1.default.array()
        .items(joi_1.default.string()
        .pattern(/^(\+[1-9]\d{1,14}|whatsapp:\+\d{1,15})$/)
        .required())
        .min(1)
        .max(1000)
        .required()
        .messages({
        "array.min": "At least one recipient is required",
        "array.max": "Cannot send to more than 1000 recipients at once",
        "any.required": "Recipients array is required",
    }),
    body: joi_1.default.string().min(1).max(1600).required().messages({
        "string.empty": "Message body cannot be empty",
        "string.max": "Message cannot exceed 1600 characters",
        "any.required": "Message body is required",
    }),
});
//# sourceMappingURL=twilioSchema.js.map