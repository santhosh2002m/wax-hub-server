"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twilioController_1 = require("../controllers/twilioController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Added authorizeAdminOrManager
const router = express_1.default.Router();
// Public webhook for Twilio status updates
router.post("/webhook", twilioController_1.handleTwilioWebhook);
// Protected routes
router.post("/send", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, twilioController_1.sendSingleMessage);
router.post("/send-bulk", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, twilioController_1.sendBulkMessages);
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, twilioController_1.getMessages); // Changed to allow managers
router.get("/stats", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, twilioController_1.getMessageStats); // Changed to allow managers
router.get("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, twilioController_1.getMessageById); // Changed to allow managers
exports.default = router;
//# sourceMappingURL=twilioRoutes.js.map