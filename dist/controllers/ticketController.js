"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicket = exports.addTicket = exports.getTicketById = exports.getTickets = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const ticketSchema_1 = require("../schemas/ticketSchema");
const sequelize_1 = require("sequelize");
// FILE: controllers/ticketController.ts
// ... existing imports ...
const getTickets = async (req, res) => {
    try {
        const user = req.user;
        // If user is admin, show ONLY admin-created tickets (is_analytics: false)
        if (user.role === "admin") {
            const tickets = await ticketModel_1.default.findAll({
                where: {
                    is_analytics: false, // Only admin-created tickets
                },
                attributes: [
                    "id",
                    "price",
                    "dropdown_name",
                    "show_name",
                    "createdAt",
                    "is_analytics",
                    "counter_id",
                ],
                order: [["createdAt", "DESC"]],
            });
            return res.json(tickets);
        }
        // For non-admin users, show admin-created tickets and their own user-created tickets
        const tickets = await ticketModel_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { is_analytics: false }, // Admin-created tickets
                    { counter_id: user.id }, // Their own user-created tickets
                ],
            },
            attributes: [
                "id",
                "price",
                "dropdown_name",
                "show_name",
                "createdAt",
                "is_analytics",
                "counter_id",
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json(tickets);
    }
    catch (error) {
        console.error("Error in getTickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTickets = getTickets;
// ... rest of the file remains the same ...
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const ticketId = parseInt(id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ message: "Invalid ticket ID" });
        }
        let whereClause = { id: ticketId };
        // If user is admin, restrict to admin-created tickets only
        if (user.role === "admin") {
            whereClause.is_analytics = false; // Only admin tickets
        }
        else {
            // For non-admin users, restrict access
            whereClause[sequelize_1.Op.or] = [
                { is_analytics: false }, // Admin-created tickets
                { counter_id: user.id }, // Their own user-created tickets
            ];
        }
        const ticket = await ticketModel_1.default.findOne({
            where: whereClause,
            attributes: [
                "id",
                "price",
                "dropdown_name",
                "show_name",
                "createdAt",
                "is_analytics",
                "counter_id",
            ],
        });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(ticket);
    }
    catch (error) {
        console.error("Error in getTicketById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTicketById = getTicketById;
const addTicket = async (req, res) => {
    try {
        const { error } = ticketSchema_1.ticketCreateSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((err) => err.message),
            });
        }
        const user = req.user;
        const { dropdown_name, show_name, price } = req.body;
        // FIX: Only set is_analytics to true for user-created tickets
        const isAnalytics = user.role === "user"; // User-created tickets affect analytics
        const ticket = await ticketModel_1.default.create({
            price: price,
            dropdown_name: dropdown_name,
            show_name: show_name,
            counter_id: user.id,
            is_analytics: false,
        });
        res.status(201).json({
            message: "Ticket created successfully",
            ticket: {
                id: ticket.id,
                price: ticket.price,
                dropdown_name: ticket.dropdown_name,
                show_name: ticket.show_name,
                is_analytics: ticket.is_analytics,
                counter_id: ticket.counter_id,
                createdAt: ticket.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error in addTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addTicket = addTicket;
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = ticketSchema_1.ticketUpdateSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((err) => err.message),
            });
        }
        const ticketId = parseInt(id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ message: "Invalid ticket ID" });
        }
        const user = req.user;
        let whereClause = { id: ticketId };
        // If user is not admin, restrict access to their own tickets or admin tickets
        if (user.role !== "admin") {
            whereClause[sequelize_1.Op.or] = [
                { is_analytics: false }, // Can update admin-created tickets
                { counter_id: user.id }, // Can update their own user-created tickets
            ];
        }
        const ticket = await ticketModel_1.default.findOne({
            where: whereClause,
        });
        if (!ticket)
            return res.status(404).json({ message: "Ticket not found" });
        await ticket.update(req.body);
        res.json({
            message: "Ticket updated successfully",
            ticket: {
                id: ticket.id,
                price: ticket.price,
                dropdown_name: ticket.dropdown_name,
                show_name: ticket.show_name,
                is_analytics: ticket.is_analytics,
                counter_id: ticket.counter_id,
                createdAt: ticket.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error in updateTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketId = parseInt(id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ message: "Invalid ticket ID" });
        }
        const user = req.user;
        let whereClause = { id: ticketId };
        // If user is not admin, restrict deletion to their own tickets
        if (user.role !== "admin") {
            whereClause.counter_id = user.id; // Only allow deleting their own tickets
        }
        const ticket = await ticketModel_1.default.findOne({
            where: whereClause,
        });
        if (!ticket)
            return res.status(404).json({ message: "Ticket not found" });
        // DELETE related transactions instead of setting to null
        await transactionModel_1.default.destroy({ where: { ticket_id: ticketId } });
        // Then delete the ticket
        await ticketModel_1.default.destroy({ where: { id: ticketId } });
        res.json({ message: "Ticket deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteTicket = deleteTicket;
//# sourceMappingURL=ticketController.js.map