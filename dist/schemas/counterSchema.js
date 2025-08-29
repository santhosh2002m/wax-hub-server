"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.counterSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).required(),
    password: joi_1.default.string().min(6).required(),
});
