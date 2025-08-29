"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfile = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const counterModel_1 = __importDefault(require("../models/counterModel"));
const authSchema_1 = require("../schemas/authSchema");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = authSchema_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, password } = req.body;
        const counter = yield counterModel_1.default.findOne({ where: { username } });
        if (!counter || !bcryptjs_1.default.compareSync(password, counter.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: counter.id, username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // src/controllers/authController.ts - line 38
        const user = req.user;
        const userId = user.id;
        const { currentPassword, newPassword } = req.body;
        const counter = yield counterModel_1.default.findByPk(userId);
        if (!counter || !bcryptjs_1.default.compareSync(currentPassword, counter.password)) {
            return res.status(401).json({ message: "Invalid current password" });
        }
        counter.password = bcryptjs_1.default.hashSync(newPassword, 10);
        yield counter.save();
        res.status(200).json({ message: "Password updated" });
    }
    catch (error) {
        console.error("Error in editProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.editProfile = editProfile;
