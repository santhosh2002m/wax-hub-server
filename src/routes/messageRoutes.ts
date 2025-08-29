import express from "express";
import {
  sendCustomMessage,
  getSentMessages,
} from "../controllers/messageController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/send", authenticate, authorize(["admin"]), sendCustomMessage);
router.get("/sent", authenticate, authorize(["admin"]), getSentMessages);

export default router;
