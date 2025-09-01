"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketUpdateSchema = exports.ticketCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ticketCreateSchema = joi_1.default.object({
    dropdown_name: joi_1.default.string().required().messages({
        "string.empty": "Dropdown name is required",
    }),
    show_name: joi_1.default.string().required().messages({
        "string.empty": "Show name is required",
    }),
    price: joi_1.default.number().integer().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.integer": "Price must be an integer",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
    }),
});
exports.ticketUpdateSchema = joi_1.default.object({
    dropdown_name: joi_1.default.string().optional(),
    show_name: joi_1.default.string().optional(),
    price: joi_1.default.number().integer().min(0).optional(),
}).min(1);
//# sourceMappingURL=ticketSchema.js.map