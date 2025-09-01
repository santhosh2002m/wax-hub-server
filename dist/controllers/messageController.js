"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.addMessage = exports.getMessages = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const counterModel_1 = __importDefault(require("../models/counterModel")); // Added import
const messageSchema_1 = require("../schemas/messageSchema");
const getMessages = async (req, res) => {
    try {
        const messages = await messageModel_1.default.findAll({
            include: [{ model: counterModel_1.default, as: "counter" }],
        });
        res.json(messages);
    }
    catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMessages = getMessages;
const addMessage = async (req, res) => {
    try {
        const { error } = messageSchema_1.messageSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const user = req.user;
        const message = await messageModel_1.default.create({ ...req.body, counter_id: user.id });
        res
            .status(201)
            .json({ message: "Message created successfully", data: message });
    }
    catch (error) {
        console.error("Error in addMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addMessage = addMessage;
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageModel_1.default.findByPk(id);
        if (!message)
            return res.status(404).json({ message: "Message not found" });
        await message.destroy();
        res.json({ message: "Message deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messageController.js.map