"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTicketSchema = exports.userRegisterSchema = exports.userLoginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userLoginSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        "string.empty": "Username is required",
        "any.required": "Username is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
});
exports.userRegisterSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        "string.empty": "Username is required",
        "any.required": "Username is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
    role: joi_1.default.string().valid("ticket_manager", "admin").optional().messages({
        "string.valid": "Role must be either 'ticket_manager' or 'admin'",
    }),
});
exports.userTicketSchema = joi_1.default.object({
    vehicle_type: joi_1.default.string().allow("", null).optional().messages({
        "string.empty": "Vehicle type cannot be empty", // Won't trigger due to allow("")
    }),
    guide_name: joi_1.default.string().allow("", null).optional().messages({
        "string.empty": "Guide name cannot be empty", // Won't trigger due to allow("")
    }),
    guide_number: joi_1.default.string().allow("", null).optional().messages({
        "string.empty": "Guide number cannot be empty", // Won't trigger due to allow("")
    }),
    show_name: joi_1.default.string().allow("", null).optional().messages({
        "string.empty": "Show name cannot be empty", // Won't trigger due to allow("")
    }),
    adults: joi_1.default.number().integer().min(0).allow(null).optional().messages({
        "number.base": "Adults must be a number",
        "number.integer": "Adults must be an integer",
        "number.min": "Adults cannot be negative",
    }),
    ticket_price: joi_1.default.number().min(0).allow(null).optional().messages({
        "number.base": "Ticket price must be a number",
        "number.min": "Ticket price cannot be negative",
    }),
    total_price: joi_1.default.number().min(0).allow(null).optional().messages({
        "number.base": "Total price must be a number",
        "number.min": "Total price cannot be negative",
    }),
    tax: joi_1.default.number().min(0).allow(null).optional().messages({
        "number.base": "Tax must be a number",
        "number.min": "Tax cannot be negative",
    }),
    final_amount: joi_1.default.number().min(0).allow(null).optional().messages({
        "number.base": "Final amount must be a number",
        "number.min": "Final amount cannot be negative",
    }),
});
//# sourceMappingURL=userSchema.js.map