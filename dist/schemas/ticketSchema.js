"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ticketSchema = joi_1.default.object({
    price: joi_1.default.number().integer().positive().required(),
    dropdown_name: joi_1.default.string().optional(),
    show_name: joi_1.default.string().optional(),
});
