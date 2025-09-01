"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpecialTicket = exports.getSpecialTickets = exports.createSpecialTicket = void 0;
const SpecialTicket_1 = __importDefault(require("../models/SpecialTicket"));
const userSchema_1 = require("../schemas/userSchema");
const sequelize_1 = require("sequelize");
const counterModel_1 = __importDefault(require("../models/counterModel"));
const uuid_1 = require("uuid");
const createSpecialTicket = async (req, res) => {
    try {
        const { error } = userSchema_1.userTicketSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((err) => err.message),
            });
        }
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const counter = await counterModel_1.default.findByPk(user.id);
        if (!counter) {
            return res.status(404).json({ message: "Counter not found" });
        }
        // Allow special counters OR admins to create special tickets
        if (!counter.special && user.role !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied: Special counter or admin required" });
        }
        const generateInvoiceNo = async () => {
            return `SPT${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        };
        const invoice_no = await generateInvoiceNo();
        const ticketData = {
            ...req.body,
            invoice_no,
            counter_id: user.id,
            status: "completed",
        };
        // FIX: Only create the SpecialTicket, DO NOT create admin dashboard Ticket
        const ticket = await SpecialTicket_1.default.create(ticketData);
        // FIX: Also skip creating Transaction record since it references the admin Ticket
        // await Transaction.create({
        //   invoice_no: ticket.invoice_no,
        //   date: new Date(),
        //   adult_count: ticketData.adults || 0,
        //   child_count: 0,
        //   category: "Special",
        //   total_paid: ticketData.final_amount || 0,
        //   ticket_id: adminTicket.id, // This would reference the admin ticket
        //   counter_id: user.id,
        // });
        res.status(201).json({
            message: "Special ticket created successfully",
            ticket: {
                id: ticket.id,
                invoice_no: ticket.invoice_no,
                vehicle_type: ticket.vehicle_type,
                guide_name: ticket.guide_name,
                guide_number: ticket.guide_number,
                show_name: ticket.show_name,
                adults: ticket.adults,
                ticket_price: ticket.ticket_price,
                total_price: ticket.total_price,
                tax: ticket.tax,
                final_amount: ticket.final_amount,
                status: ticket.status,
                createdAt: ticket.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error in createSpecialTicket:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                message: "Failed to create ticket due to duplicate data",
                error: "Please try again with different details",
            });
        }
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ message: "Validation error: " + error.errors[0].message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createSpecialTicket = createSpecialTicket;
// FILE: controllers/specialTicketController.ts (update getSpecialTickets function)
const getSpecialTickets = async (req, res) => {
    try {
        const user = req.user;
        const counter = await counterModel_1.default.findByPk(user.id);
        if (!counter) {
            return res.status(404).json({ message: "Counter not found" });
        }
        // Allow special counters, admins, and managers to view special tickets
        if (!counter.special && user.role !== "admin" && user.role !== "manager") {
            return res.status(403).json({
                message: "Access denied: Special counter, admin, or manager required",
            });
        }
        const { startDate, endDate, search, page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;
        // Get today's date range (only show today's tickets by default)
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        let whereClause = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfToday, endOfToday],
            },
        };
        // For special counters, only show their own tickets
        if (counter.special && user.role !== "admin") {
            whereClause.counter_id = user.id;
        }
        // If date range is provided (for admin viewing historical data)
        if (startDate && endDate) {
            whereClause.createdAt = {
                [sequelize_1.Op.between]: [
                    new Date(startDate),
                    new Date(endDate),
                ],
            };
        }
        if (search) {
            whereClause[sequelize_1.Op.or] = [
                { guide_name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { guide_number: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { invoice_no: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { vehicle_type: { [sequelize_1.Op.iLike]: `%${search}%` } },
            ];
        }
        const { count, rows: tickets } = await SpecialTicket_1.default.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: limitNum,
            offset,
        });
        res.json({
            tickets: tickets.map((ticket) => ({
                id: ticket.id,
                invoice_no: ticket.invoice_no,
                vehicle_type: ticket.vehicle_type,
                guide_name: ticket.guide_name,
                guide_number: ticket.guide_number,
                show_name: ticket.show_name,
                adults: ticket.adults,
                ticket_price: ticket.ticket_price,
                total_price: ticket.total_price,
                tax: ticket.tax,
                final_amount: ticket.final_amount,
                status: ticket.status,
                createdAt: ticket.createdAt,
            })),
            total: count,
            page: pageNum,
            pages: Math.ceil(count / limitNum),
        });
    }
    catch (error) {
        console.error("Error in getSpecialTickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getSpecialTickets = getSpecialTickets;
const deleteSpecialTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const ticket = await SpecialTicket_1.default.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ message: "Special ticket not found" });
        }
        // Check permissions: admin or the counter that created the ticket
        if (user.role !== "admin" && ticket.counter_id !== user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        // FIX: Since we're not creating Transaction records anymore, just delete the special ticket
        await ticket.destroy();
        res.json({ message: "Special ticket deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteSpecialTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteSpecialTicket = deleteSpecialTicket;
//# sourceMappingURL=specialTicketController.js.map