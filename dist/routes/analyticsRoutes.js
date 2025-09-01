"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// FILE: routes/analyticsRoutes.ts
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Changed from authorizeAdmin to authorizeAdminOrManager
const router = express_1.default.Router();
router.get("/today", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.getTodayOverview);
router.get("/last7days", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.getLast7Days);
router.get("/last30days", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.getLast30Days);
router.get("/annual", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.getAnnualPerformance);
router.get("/calendar", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.getCalendarView);
router.delete("/calendar/:invoice_no", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.deleteCalendarTransaction);
router.put("/calendar/:invoice_no", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, analyticsController_1.updateCalendarTransaction);
exports.default = router;
//# sourceMappingURL=analyticsRoutes.js.map