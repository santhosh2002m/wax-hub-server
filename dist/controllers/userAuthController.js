"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChangePassword = exports.userRegister = exports.userLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const counterModel_1 = __importDefault(require("../models/counterModel")); // Use Counter instead of User
const userSchema_1 = require("../schemas/userSchema");
// Make sure user login returns proper role information
// controllers/userAuthController.ts - Update the userLogin function
const userLogin = async (req, res) => {
    try {
        const { error } = userSchema_1.userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, password } = req.body;
        const counter = await counterModel_1.default.findOne({ where: { username } });
        if (!counter ||
            !bcryptjs_1.default.compareSync(password, counter.password) ||
            (counter.role !== "user" && !counter.special) // Allow both user and special counters
        ) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: counter.id,
            username,
            role: counter.role,
            special: counter.special,
        }, process.env.JWT_SECRET, { expiresIn: "8h" });
        res.status(200).json({
            token,
            username: counter.username,
            role: counter.role,
            special: counter.special,
            createdAt: counter.createdAt,
        });
    }
    catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.userLogin = userLogin;
const userRegister = async (req, res) => {
    try {
        const { error } = userSchema_1.userLoginSchema.validate(req.body); // Reuse login schema for simplicity
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, password } = req.body;
        const existingUser = await counterModel_1.default.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const counter = await counterModel_1.default.create({
            username,
            password: hashedPassword,
            role: "user", // Force user role for user dashboard
        });
        res.status(201).json({
            id: counter.id,
            username: counter.username,
            role: counter.role,
            createdAt: counter.createdAt,
        });
    }
    catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.userRegister = userRegister;
const userChangePassword = async (req, res) => {
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
        if (!counter ||
            !bcryptjs_1.default.compareSync(currentPassword, counter.password) ||
            counter.role !== "user") {
            return res
                .status(401)
                .json({ message: "Invalid current password or role" });
        }
        counter.password = bcryptjs_1.default.hashSync(newPassword, 10);
        await counter.save();
        res.status(200).json({
            message: "Password updated successfully",
            username: counter.username,
        });
    }
    catch (error) {
        console.error("Error in user change password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.userChangePassword = userChangePassword;
//# sourceMappingURL=userAuthController.js.map