// src/routes/guideRoutes.ts
import express from "express";
import {
  getGuides,
  addGuide,
  updateGuide,
  deleteGuide,
} from "../controllers/guideController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getGuides); // Accessible to both manager and admin
router.post("/", authenticate, authorize(["admin"]), addGuide);
router.put("/:id", authenticate, authorize(["admin"]), updateGuide);
router.delete("/:id", authenticate, authorize(["admin"]), deleteGuide);

export default router;
