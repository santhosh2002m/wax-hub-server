"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userAuthRoutes.ts
const express_1 = __importDefault(require("express"));
const userAuthController_1 = require("../controllers/userAuthController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/login", userAuthController_1.userLogin);
router.post("/register", authMiddleware_1.authenticateJWT, authMiddleware_1.authorizeAdmin, userAuthController_1.userRegister);
router.put("/change-password", authMiddleware_1.authenticateJWT, userAuthController_1.userChangePassword);
exports.default = router;
//# sourceMappingURL=userAuthRoutes.js.map