// src/routes/analyticsRoutes.ts
import express from "express";
import {
  getTodayOverview,
  getCalendarView,
  getLast7Days,
  getLast30Days,
  getAnnualPerformance,
  updateTransaction,
  deleteTransaction,
} from "../controllers/analyticsController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/today", authenticate, getTodayOverview);
router.get("/last7days", authenticate, getLast7Days);
router.get("/last30days", authenticate, getLast30Days);
router.get("/annual", authenticate, getAnnualPerformance);
router.get("/calendar", authenticate, getCalendarView);
router.put(
  "/transactions/:id",
  authenticate,
  authorize(["admin"]),
  updateTransaction
);
router.delete(
  "/transactions/:id",
  authenticate,
  authorize(["admin"]),
  deleteTransaction
);

export default router;
