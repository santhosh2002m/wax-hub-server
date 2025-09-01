"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGuideUpdateSchema = exports.userGuideSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userGuideSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(255).required(),
    number: joi_1.default.string().min(1).max(20).required(),
    vehicle_type: joi_1.default.string().min(1).max(50).required(),
    score: joi_1.default.number().integer().min(0).optional(),
    total_bookings: joi_1.default.number().integer().min(0).optional(),
    rating: joi_1.default.number().min(0).max(5).optional(),
    status: joi_1.default.string().valid("active", "inactive").optional(),
});
exports.userGuideUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(255).optional(),
    number: joi_1.default.string().min(1).max(20).optional(),
    vehicle_type: joi_1.default.string().min(1).max(50).optional(),
    score: joi_1.default.number().integer().min(0).optional(),
    total_bookings: joi_1.default.number().integer().min(0).optional(),
    rating: joi_1.default.number().min(0).max(5).optional(),
    status: joi_1.default.string().valid("active", "inactive").optional(),
}).min(1);
//# sourceMappingURL=userGuideSchema.js.map