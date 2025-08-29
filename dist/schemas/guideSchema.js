"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.guideSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    number: joi_1.default.string().optional(),
    vehicle_type: joi_1.default.string().optional(),
    score: joi_1.default.number().integer().optional(),
});
