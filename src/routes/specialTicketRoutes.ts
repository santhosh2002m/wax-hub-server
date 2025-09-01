// routes/specialTicketRoutes.ts
import express from "express";
import {
  createSpecialTicket,
  getSpecialTickets,
} from "../controllers/specialTicketController";
import {
  authenticateJWT,
  authorizeManager,
  authorizeUser,
} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, authorizeManager, createSpecialTicket);
router.get("/", authenticateJWT, authorizeUser, getSpecialTickets); // Updated to use authorizeUser

export default router;
