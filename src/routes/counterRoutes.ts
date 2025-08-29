// src/routes/counterRoutes.ts
import express from "express";
import {
  addCounter,
  deleteCounter,
  getCounters,
  registerAdmin,
  changePassword,
} from "../controllers/counterController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getCounters); // Accessible to both manager and admin
router.post("/", authenticate, authorize(["admin"]), addCounter);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCounter);
router.post("/register", authenticate, authorize(["admin"]), registerAdmin);
router.put("/change-password", authenticate, changePassword); // Allow any authenticated user to change their own password

export default router;
