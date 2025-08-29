"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticate, ticketController_1.getTickets);
router.post("/", authMiddleware_1.authenticate, ticketController_1.addTicket);
router.put("/:id", authMiddleware_1.authenticate, ticketController_1.updateTicket);
router.delete("/:id", authMiddleware_1.authenticate, ticketController_1.deleteTicket);
exports.default = router;
