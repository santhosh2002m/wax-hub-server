"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfile = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const counterModel_1 = __importDefault(require("../models/counterModel"));
const authSchema_1 = require("../schemas/authSchema");
// controllers/authController.ts - Update the login function
const login = async (req, res) => {
    try {
        const { error } = authSchema_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, password } = req.body;
        const counter = await counterModel_1.default.findOne({ where: { username } });
        if (!counter || !bcryptjs_1.default.compareSync(password, counter.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (counter.role === "user" && !counter.special) {
            return res
                .status(403)
                .json({ message: "Use /api/user/auth/login for user dashboard" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: counter.id,
            username,
            role: counter.role,
            special: counter.special,
        }, process.env.JWT_SECRET, { expiresIn: "8h" } // Increased timeout for better user experience
        );
        res.status(200).json({
            token,
            username: counter.username,
            role: counter.role,
            createdAt: counter.createdAt,
            special: counter.special, // Make sure this is included
        });
    }
    catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const editProfile = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const { currentPassword, newPassword } = req.body;
        if (newPassword.length < 6) {
            return res
                .status(400)
                .json({ message: "New password must be at least 6 characters long" });
        }
        const counter = await counterModel_1.default.findByPk(userId);
        if (!counter || !bcryptjs_1.default.compareSync(currentPassword, counter.password)) {
            return res.status(401).json({ message: "Invalid current password" });
        }
        counter.password = bcryptjs_1.default.hashSync(newPassword, 10);
        await counter.save();
        res.status(200).json({
            message: "Password updated successfully",
            username: counter.username,
            role: counter.role,
            createdAt: counter.createdAt,
        });
    }
    catch (error) {
        console.error("Error in editProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.editProfile = editProfile;
//# sourceMappingURL=authController.js.map