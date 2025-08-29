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
exports.getLast30Days = exports.getLast7Days = exports.getCalendarView = exports.getTodayOverview = void 0;
const sequelize_1 = require("sequelize");
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const luxon_1 = require("luxon");
const calculateGrowth = (current, previous) => previous ? ((current - previous) / previous) * 100 : 0;
const getTodayOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = luxon_1.DateTime.now().startOf("day").toJSDate();
        const yesterday = luxon_1.DateTime.now()
            .minus({ days: 1 })
            .startOf("day")
            .toJSDate();
        const todayTickets = yield transactionModel_1.default.count({
            where: { date: { [sequelize_1.Op.gte]: today } },
        });
        const yesterdayTickets = yield transactionModel_1.default.count({
            where: { date: { [sequelize_1.Op.gte]: yesterday, [sequelize_1.Op.lt]: today } },
        });
        const ticketGrowth = calculateGrowth(todayTickets, yesterdayTickets);
        const todayAmount = (yield transactionModel_1.default.sum("total_paid", {
            where: { date: { [sequelize_1.Op.gte]: today } },
        })) || 0;
        const yesterdayAmount = (yield transactionModel_1.default.sum("total_paid", {
            where: {
                date: { [sequelize_1.Op.gte]: yesterday, [sequelize_1.Op.lt]: today },
            },
        })) || 0;
        const amountGrowth = calculateGrowth(todayAmount, yesterdayAmount);
        // Fix for attractions query
        const attractions = yield transactionModel_1.default.findAll({
            attributes: [
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("total_paid")), "total"],
                [(0, sequelize_1.col)("ticket.show_name"), "show_name"],
            ],
            include: [
                {
                    model: ticketModel_1.default,
                    attributes: [],
                    as: "ticket",
                },
            ],
            group: ["ticket.show_name"],
            where: { date: { [sequelize_1.Op.gte]: today } },
            raw: true,
        });
        // Fix for hourly sales query
        const hourlySales = yield transactionModel_1.default.findAll({
            attributes: [
                [(0, sequelize_1.fn)("EXTRACT", (0, sequelize_1.literal)('HOUR FROM "date"')), "hour"],
                [(0, sequelize_1.fn)("COUNT", "*"), "sales"],
            ],
            group: [(0, sequelize_1.fn)("EXTRACT", (0, sequelize_1.literal)('HOUR FROM "date"'))],
            where: { date: { [sequelize_1.Op.gte]: today } },
            raw: true,
        });
        res.json({
            totalTickets: todayTickets,
            totalAmount: todayAmount,
            growth: { tickets: ticketGrowth, amount: amountGrowth },
            attractions: attractions,
            hourlySales: hourlySales,
        });
    }
    catch (error) {
        console.error("Error in getTodayOverview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTodayOverview = getTodayOverview;
const getCalendarView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res
                .status(400)
                .json({ message: "Start and end dates are required" });
        }
        const transactions = yield transactionModel_1.default.findAll({
            where: {
                date: {
                    [sequelize_1.Op.between]: [new Date(start), new Date(end)],
                },
            },
        });
        const totalSales = transactions.length;
        const totalAmount = transactions.reduce((sum, tx) => sum + tx.total_paid, 0);
        res.json({ totalSales, totalAmount, transactions });
    }
    catch (error) {
        console.error("Error in getCalendarView:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCalendarView = getCalendarView;
// Additional analytics functions
const getLast7Days = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sevenDaysAgo = luxon_1.DateTime.now()
            .minus({ days: 7 })
            .startOf("day")
            .toJSDate();
        const today = luxon_1.DateTime.now().endOf("day").toJSDate();
        const transactions = yield transactionModel_1.default.findAll({
            where: { date: { [sequelize_1.Op.between]: [sevenDaysAgo, today] } },
        });
        const totalSales = transactions.length;
        const totalAmount = transactions.reduce((sum, tx) => sum + tx.total_paid, 0);
        res.json({ totalSales, totalAmount, transactions });
    }
    catch (error) {
        console.error("Error in getLast7Days:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLast7Days = getLast7Days;
const getLast30Days = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thirtyDaysAgo = luxon_1.DateTime.now()
            .minus({ days: 30 })
            .startOf("day")
            .toJSDate();
        const today = luxon_1.DateTime.now().endOf("day").toJSDate();
        const transactions = yield transactionModel_1.default.findAll({
            where: { date: { [sequelize_1.Op.between]: [thirtyDaysAgo, today] } },
        });
        const totalSales = transactions.length;
        const totalAmount = transactions.reduce((sum, tx) => sum + tx.total_paid, 0);
        res.json({ totalSales, totalAmount, transactions });
    }
    catch (error) {
        console.error("Error in getLast30Days:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLast30Days = getLast30Days;
