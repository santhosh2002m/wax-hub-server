"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userGuideController_1 = require("../controllers/userGuideController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdminOrManager, userGuideController_1.getUserGuides); // Updated middleware
router.post("/", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userGuideController_1.createUserGuide);
router.put("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userGuideController_1.updateUserGuide);
router.delete("/:id", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userGuideController_1.deleteUserGuide);
exports.default = router;
//# sourceMappingURL=guideRoutes.js.map