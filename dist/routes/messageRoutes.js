"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Added authorizeAdminOrManager
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, messageController_1.getMessages); // Changed to allow managers
router.post("/", authMiddleware_1.authenticateJWT, messageController_1.addMessage);
router.delete("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, messageController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map