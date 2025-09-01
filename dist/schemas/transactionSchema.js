"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionUpdateSchema = exports.transactionSchema = void 0;
// ===== FILE: schemas/transactionSchema.ts =====
// src/schemas/transactionSchema.ts
const joi_1 = __importDefault(require("joi"));
exports.transactionSchema = joi_1.default.object({
    adult_count: joi_1.default.number().integer().min(0).optional(),
    child_count: joi_1.default.number().integer().min(0).optional(),
    category: joi_1.default.string()
        .valid("Adult", "Child", "Senior", "Group", "Special", "Other")
        .optional(),
    total_paid: joi_1.default.number().positive().optional(),
    show_name: joi_1.default.string().optional(), // Allow updating show_name via ticket
    date: joi_1.default.date().optional(),
    vehicle_type: joi_1.default.string().optional(),
    guide_name: joi_1.default.string().optional(),
    guide_number: joi_1.default.string().optional(),
    adults: joi_1.default.number().integer().min(0).optional(),
    ticket_price: joi_1.default.number().min(0).optional(),
    total_price: joi_1.default.number().min(0).optional(),
    tax: joi_1.default.number().min(0).optional(),
    final_amount: joi_1.default.number().min(0).optional(),
    price: joi_1.default.number().min(0).optional(),
});
exports.transactionUpdateSchema = joi_1.default.object({
    adult_count: joi_1.default.number().integer().min(0).optional(),
    child_count: joi_1.default.number().integer().min(0).optional(),
    category: joi_1.default.string()
        .valid("Adult", "Child", "Senior", "Group", "Special", "Other")
        .optional(),
    total_paid: joi_1.default.number().positive().optional(),
    show_name: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    vehicle_type: joi_1.default.string().optional(),
    guide_name: joi_1.default.string().optional(),
    guide_number: joi_1.default.string().optional(),
    adults: joi_1.default.number().integer().min(0).optional(),
    ticket_price: joi_1.default.number().min(0).optional(),
    total_price: joi_1.default.number().min(0).optional(),
    tax: joi_1.default.number().min(0).optional(),
    final_amount: joi_1.default.number().min(0).optional(),
    price: joi_1.default.number().min(0).optional(),
}).min(1);
//# sourceMappingURL=transactionSchema.js.map