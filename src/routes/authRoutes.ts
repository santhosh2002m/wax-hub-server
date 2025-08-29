// src/routes/authRoutes.ts
import express from "express";
import { login, editProfile } from "../controllers/authController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.put("/profile", authenticate, authorize(["admin"]), editProfile); // Only admins can edit profile

export default router;
