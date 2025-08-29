"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guideController_1 = require("../controllers/guideController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticate, guideController_1.getGuides);
router.post("/", authMiddleware_1.authenticate, guideController_1.addGuide);
router.put("/:id", authMiddleware_1.authenticate, guideController_1.updateGuide);
router.delete("/:id", authMiddleware_1.authenticate, guideController_1.deleteGuide);
exports.default = router;
