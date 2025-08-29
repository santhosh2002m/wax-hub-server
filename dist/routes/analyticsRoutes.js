"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/today", authMiddleware_1.authenticate, analyticsController_1.getTodayOverview);
router.get("/calendar", authMiddleware_1.authenticate, analyticsController_1.getCalendarView);
router.get("/last7days", authMiddleware_1.authenticate, analyticsController_1.getLast7Days);
router.get("/last30days", authMiddleware_1.authenticate, analyticsController_1.getLast30Days);
exports.default = router;
