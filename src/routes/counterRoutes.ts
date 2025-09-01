import express from "express";
import {
  addCounter,
  deleteCounter,
  getCounters,
  registerAdmin,
  changePassword,
} from "../controllers/counterController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, authorizeAdmin, addCounter);
router.delete("/:username", authenticateJWT, authorizeAdmin, deleteCounter); // Changed :id to :username
router.get("/", authenticateJWT, authorizeAdmin, getCounters);
router.post("/register", authenticateJWT, authorizeAdmin, registerAdmin);
router.put("/password", authenticateJWT, changePassword);

export default router;
