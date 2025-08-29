import express from "express";
import {
  getUserGuides,
  getUserGuide,
  createUserGuide,
  updateUserGuide,
  deleteUserGuide,
  getTopPerformers,
} from "../controllers/userGuideController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getUserGuides);
router.get("/top", authenticate, getTopPerformers);
router.get("/:id", authenticate, getUserGuide);
router.post("/", authenticate, authorize(["admin"]), createUserGuide);
router.put("/:id", authenticate, authorize(["admin"]), updateUserGuide);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUserGuide);

export default router;
