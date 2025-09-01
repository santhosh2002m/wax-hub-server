"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const counterController_1 = require("../controllers/counterController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Added authorizeAdminOrManager
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, counterController_1.addCounter);
router.delete("/:username", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, counterController_1.deleteCounter);
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, counterController_1.getCounters); // Changed to allow managers
router.post("/register", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, counterController_1.registerAdmin);
router.put("/password", authMiddleware_1.authenticateJWT, counterController_1.changePassword);
exports.default = router;
//# sourceMappingURL=counterRoutes.js.map