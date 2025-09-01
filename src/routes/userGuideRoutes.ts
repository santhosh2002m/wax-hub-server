import express from "express";
import {
  getUserGuides,
  getUserGuide,
  createUserGuide,
  updateUserGuide,
  deleteUserGuide,
  getTopPerformers,
} from "../controllers/userGuideController";
import {
  authenticateJWT,
  authorizeAdmin,
  authorizeAdminOrUser, // Import the new middleware
} from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdminOrUser, getUserGuides); // Updated middleware
router.get("/top", authenticateJWT, authorizeAdminOrUser, getTopPerformers); // Updated middleware
router.get("/:id", authenticateJWT, authorizeAdminOrUser, getUserGuide); // Updated middleware
router.post("/", authenticateJWT, authorizeAdmin, createUserGuide);
router.put("/:id", authenticateJWT, authorizeAdmin, updateUserGuide);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteUserGuide);

export default router;
