"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const counterController_1 = require("../controllers/counterController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticate, counterController_1.getCounters);
router.post("/", authMiddleware_1.authenticate, counterController_1.addCounter);
router.delete("/:id", authMiddleware_1.authenticate, counterController_1.deleteCounter);
exports.default = router;
