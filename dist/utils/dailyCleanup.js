"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDailyCleanup = exports.cleanupOldTickets = void 0;
// FILE: utils/dailyCleanup.ts
const sequelize_1 = require("sequelize");
const userticketModel_1 = __importDefault(require("../models/userticketModel"));
const SpecialTicket_1 = __importDefault(require("../models/SpecialTicket"));
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
/**
 * Clean up user tickets and special tickets from previous days
 * This should be called daily at midnight
 */
const cleanupOldTickets = async () => {
    try {
        // Get yesterday's date (start of yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        // Get today's date (start of today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(`Cleaning up tickets created before: ${today}`);
        // Delete user tickets from previous days
        const userTicketsDeleted = await userticketModel_1.default.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: today,
                },
            },
        });
        // Delete special tickets from previous days
        const specialTicketsDeleted = await SpecialTicket_1.default.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: today,
                },
            },
        });
        // Also delete associated admin tickets and transactions for user tickets
        // First find all user ticket invoice numbers that were deleted
        const deletedUserTickets = await userticketModel_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: today,
                },
            },
            attributes: ["invoice_no"],
            paranoid: false, // Include soft-deleted records if any
        });
        const invoiceNos = deletedUserTickets.map((ticket) => ticket.invoice_no);
        if (invoiceNos.length > 0) {
            // Delete associated transactions
            await transactionModel_1.default.destroy({
                where: {
                    invoice_no: invoiceNos,
                },
            });
            // Find and delete associated admin tickets
            const transactions = await transactionModel_1.default.findAll({
                where: {
                    invoice_no: invoiceNos,
                },
                attributes: ["ticket_id"],
                paranoid: false,
            });
            const ticketIds = transactions
                .map((t) => t.ticket_id)
                .filter((id) => id !== null);
            if (ticketIds.length > 0) {
                await ticketModel_1.default.destroy({
                    where: {
                        id: ticketIds,
                    },
                });
            }
        }
        console.log(`Daily cleanup completed: ${userTicketsDeleted} user tickets and ${specialTicketsDeleted} special tickets deleted`);
        return {
            userTicketsDeleted,
            specialTicketsDeleted,
        };
    }
    catch (error) {
        console.error("Error in daily ticket cleanup:", error);
        throw error;
    }
};
exports.cleanupOldTickets = cleanupOldTickets;
/**
 * Schedule daily cleanup at midnight
 */
const scheduleDailyCleanup = () => {
    // Calculate time until next midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    // Schedule first cleanup at next midnight
    setTimeout(() => {
        // Run cleanup immediately at midnight
        (0, exports.cleanupOldTickets)().catch(console.error);
        // Then schedule cleanup every 24 hours
        setInterval(() => {
            (0, exports.cleanupOldTickets)().catch(console.error);
        }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
    console.log("Daily ticket cleanup scheduled");
};
exports.scheduleDailyCleanup = scheduleDailyCleanup;
//# sourceMappingURL=dailyCleanup.js.map