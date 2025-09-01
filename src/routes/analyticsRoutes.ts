// ===== FILE: routes/analyticsRoutes.ts =====
import express from "express";
import {
  getTodayOverview,
  getLast7Days,
  getLast30Days,
  getAnnualPerformance,
  getCalendarView,
  deleteCalendarTransaction,
  updateCalendarTransaction,
} from "../controllers/analyticsController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/today", authenticateJWT, authorizeAdmin, getTodayOverview);
router.get("/last7days", authenticateJWT, authorizeAdmin, getLast7Days);
router.get("/last30days", authenticateJWT, authorizeAdmin, getLast30Days);
router.get("/annual", authenticateJWT, authorizeAdmin, getAnnualPerformance);
router.get("/calendar", authenticateJWT, authorizeAdmin, getCalendarView);
router.delete(
  "/calendar/:invoice_no",
  authenticateJWT,
  authorizeAdmin,
  deleteCalendarTransaction
);
router.put(
  "/calendar/:invoice_no",
  authenticateJWT,
  authorizeAdmin,
  updateCalendarTransaction
);

export default router;
