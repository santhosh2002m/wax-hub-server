"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecialCounter = exports.changePassword = exports.registerAdmin = exports.getCounters = exports.deleteCounter = exports.addCounter = void 0;
const counterModel_1 = __importDefault(require("../models/counterModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const counterSchema_1 = require("../schemas/counterSchema");
const addCounter = async (req, res) => {
    try {
        const { error } = counterSchema_1.counterSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { username, password, special, role } = req.body;
        const existingCounter = await counterModel_1.default.findOne({ where: { username } });
        if (existingCounter) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const counter = await counterModel_1.default.create({
            username,
            password: hashedPassword,
            role: role || "manager",
            special: special || false,
        });
        res.status(201).json({
            id: counter.id,
            username: counter.username,
            role: counter.role,
            special: counter.special,
            createdAt: counter.createdAt,
        });
    }
    catch (error) {
        console.error("Error in addCounter:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addCounter = addCounter;
const deleteCounter = async (req, res) => {
    try {
        const { username } = req.params;
        const counter = await counterModel_1.default.findOne({ where: { username } });
        if (!counter)
            return res.status(404).json({ message: "Counter not found" });
        if (counter.username === "special_counter") {
            return res
                .status(403)
                .json({ message: "Cannot delete the special counter" });
        }
        // First delete associated messages instead of setting counter_id to null
        await messageModel_1.default.destroy({ where: { counter_id: counter.id } });
        // Set counter_id to null in transactions table
        await transactionModel_1.default.update({ counter_id: null }, { where: { counter_id: counter.id } });
        await counterModel_1.default.destroy({ where: { username } });
        res.json({ message: "Counter deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteCounter:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteCounter = deleteCounter;
const getCounters = async (req, res) => {
    try {
        const counters = await counterModel_1.default.findAll({
            attributes: { exclude: ["password"] },
        });
        res.json(counters);
    }
    catch (error) {
        console.error("Error in getCounters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCounters = getCounters;
const registerAdmin = async (req, res) => {
    try {
        const { error } = counterSchema_1.counterSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { username, password, role, special } = req.body;
        const existingUser = await counterModel_1.default.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const validRoles = ["admin", "manager", "user"];
        if (role && !validRoles.includes(role)) {
            return res
                .status(400)
                .json({ message: "Role must be 'admin', 'manager', or 'user'" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const counter = await counterModel_1.default.create({
            username,
            password: hashedPassword,
            role: role || "manager",
            special: special || false,
        });
        res.status(201).json({
            message: `User created successfully (role: ${counter.role})`,
            username: counter.username,
            role: counter.role,
            special: counter.special,
            createdAt: counter.createdAt,
        });
    }
    catch (error) {
        console.error("Error in registerAdmin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerAdmin = registerAdmin;
const changePassword = async (req, res) => {
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
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.changePassword = changePassword;
// FILE: controllers/counterController.ts
const createSpecialCounter = async () => {
    try {
        const username = "special_counter";
        const password = "SpecialPass123!";
        const existingCounter = await counterModel_1.default.findOne({ where: { username } });
        if (!existingCounter) {
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            await counterModel_1.default.create({
                username,
                password: hashedPassword,
                role: "manager", // Changed from "user" to "manager"
                special: true,
            });
            console.log("Special counter created with username: special_counter");
        }
    }
    catch (error) {
        console.error("Error creating special counter:", error);
    }
};
exports.createSpecialCounter = createSpecialCounter;
//# sourceMappingURL=counterController.js.map