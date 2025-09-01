import express from "express";
import {
  sendSingleMessage,
  sendBulkMessages,
  getMessages,
  getMessageById,
  getMessageStats,
  handleTwilioWebhook,
} from "../controllers/twilioController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// Public webhook for Twilio status updates
router.post("/webhook", handleTwilioWebhook);

// Protected routes
router.post("/send", authenticateJWT, authorizeAdmin, sendSingleMessage);
router.post("/send-bulk", authenticateJWT, authorizeAdmin, sendBulkMessages);
router.get("/", authenticateJWT, authorizeAdmin, getMessages);
router.get("/stats", authenticateJWT, authorizeAdmin, getMessageStats);
router.get("/:id", authenticateJWT, authorizeAdmin, getMessageById);

export default router;
