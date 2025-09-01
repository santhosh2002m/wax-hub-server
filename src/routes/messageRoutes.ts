import express from "express";
import {
  getMessages,
  addMessage,
  deleteMessage,
} from "../controllers/messageController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdmin, getMessages);
router.post("/", authenticateJWT, addMessage);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteMessage);

export default router;
