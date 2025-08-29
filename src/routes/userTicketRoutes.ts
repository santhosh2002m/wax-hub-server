import express from "express";
import {
  createUserTicket,
  getUserTickets,
  deleteUserTicket,
} from "../controllers/userTicketController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createUserTicket);
router.get("/", authenticate, getUserTickets);
router.delete("/:id", authenticate, deleteUserTicket);

export default router;
