"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/specialTicketRoutes.ts
const express_1 = __importDefault(require("express"));
const specialTicketController_1 = require("../controllers/specialTicketController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeSpecialCounter, specialTicketController_1.createSpecialTicket);
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, specialTicketController_1.getSpecialTickets); // Changed to allow managers
router.delete("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, // Changed to allow managers
specialTicketController_1.deleteSpecialTicket);
exports.default = router;
//# sourceMappingURL=specialTicketRoutes.js.map