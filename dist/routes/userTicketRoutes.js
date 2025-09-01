"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userTicketController_1 = require("../controllers/userTicketController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeUser, userTicketController_1.createUserTicket); // Changed middleware
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeUser, userTicketController_1.getUserTickets); // Changed middleware
router.delete("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeUser, userTicketController_1.deleteUserTicket); // Changed middleware
exports.default = router;
//# sourceMappingURL=userTicketRoutes.js.map