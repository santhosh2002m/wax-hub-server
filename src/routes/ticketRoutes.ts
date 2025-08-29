// src/routes/ticketRoutes.ts
import express from "express";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, getTickets); // Accessible to both manager and admin
router.post("/", authenticate, authorize(["admin"]), addTicket);
router.put("/:id", authenticate, authorize(["admin"]), updateTicket);
router.delete("/:id", authenticate, authorize(["admin"]), deleteTicket);

export default router;
