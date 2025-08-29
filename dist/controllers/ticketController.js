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
exports.deleteTicket = exports.updateTicket = exports.addTicket = exports.getTickets = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const ticketSchema_1 = require("../schemas/ticketSchema");
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield ticketModel_1.default.findAll();
        res.json(tickets);
    }
    catch (error) {
        console.error("Error in getTickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTickets = getTickets;
const addTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ticketSchema_1.ticketSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const ticket = yield ticketModel_1.default.create(req.body);
        res.status(201).json(ticket);
    }
    catch (error) {
        console.error("Error in addTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addTicket = addTicket;
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = ticketSchema_1.ticketSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        yield ticketModel_1.default.update(req.body, { where: { id } });
        res.json({ message: "Ticket updated" });
    }
    catch (error) {
        console.error("Error in updateTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateTicket = updateTicket;
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield ticketModel_1.default.destroy({ where: { id } });
        res.json({ message: "Ticket deleted" });
    }
    catch (error) {
        console.error("Error in deleteTicket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteTicket = deleteTicket;
