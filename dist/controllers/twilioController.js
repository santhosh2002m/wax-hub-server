"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTwilioWebhook = exports.getMessageStats = exports.getMessageById = exports.getMessages = exports.sendBulkMessages = exports.sendSingleMessage = void 0;
const twilio_1 = __importDefault(require("../config/twilio"));
const twilioMessageModel_1 = __importDefault(require("../models/twilioMessageModel"));
const sequelize_1 = require("sequelize");
const twilioSchema_1 = require("../schemas/twilioSchema");
const sendSingleMessage = async (req, res) => {
    try {
        const { error } = twilioSchema_1.messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((err) => err.message),
            });
        }
        const { to, body } = req.body;
        const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
        const from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
        try {
            const message = await twilio_1.default.messages.create({
                body,
                from,
                to: formattedTo,
            });
            const savedMessage = await twilioMessageModel_1.default.create({
                message_sid: message.sid,
                to: formattedTo,
                from: message.from,
                body: message.body,
                status: message.status,
                direction: "outbound-api",
                price: message.price,
                price_unit: message.priceUnit,
                error_code: message.errorCode ? message.errorCode.toString() : null,
                error_message: message.errorMessage,
            });
            res.status(201).json({
                message: "Message sent successfully",
                data: {
                    sid: savedMessage.message_sid,
                    to: savedMessage.to,
                    from: savedMessage.from,
                    body: savedMessage.body,
                    status: savedMessage.status,
                    price: savedMessage.price,
                    price_unit: savedMessage.price_unit,
                },
            });
        }
        catch (twilioError) {
            console.error("Twilio error:", twilioError);
            await twilioMessageModel_1.default.create({
                message_sid: `failed_${Date.now()}`,
                to: formattedTo,
                from,
                body,
                status: "failed",
                direction: "outbound-api",
                error_code: twilioError.code ? twilioError.code.toString() : null,
                error_message: twilioError.message,
            });
            return res.status(500).json({
                message: "Failed to send message",
                error: twilioError.message,
            });
        }
    }
    catch (error) {
        console.error("Error in sendSingleMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendSingleMessage = sendSingleMessage;
const sendBulkMessages = async (req, res) => {
    try {
        const { error } = twilioSchema_1.bulkMessageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((err) => err.message),
            });
        }
        const { recipients, body } = req.body;
        const from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
        const results = await Promise.allSettled(recipients.map(async (to) => {
            const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
            try {
                const message = await twilio_1.default.messages.create({
                    body,
                    from,
                    to: formattedTo,
                });
                await twilioMessageModel_1.default.create({
                    message_sid: message.sid,
                    to: formattedTo,
                    from: message.from,
                    body: message.body,
                    status: message.status,
                    direction: "outbound-api",
                    price: message.price,
                    price_unit: message.priceUnit,
                    error_code: message.errorCode ? message.errorCode.toString() : null,
                    error_message: message.errorMessage,
                });
                return {
                    to: formattedTo,
                    status: "success",
                    sid: message.sid,
                    error: null,
                };
            }
            catch (twilioError) {
                await twilioMessageModel_1.default.create({
                    message_sid: `failed_${Date.now()}_${formattedTo}`,
                    to: formattedTo,
                    from,
                    body,
                    status: "failed",
                    direction: "outbound-api",
                    error_code: twilioError.code ? twilioError.code.toString() : null,
                    error_message: twilioError.message,
                });
                return {
                    to: formattedTo,
                    status: "failed",
                    sid: null,
                    error: twilioError.message,
                };
            }
        }));
        const successful = results.filter((r) => r.status === "fulfilled" && r.value.status === "success").length;
        const failed = results.filter((r) => r.status === "fulfilled" && r.value.status === "failed").length;
        res.status(200).json({
            message: `Bulk message sending completed`,
            summary: {
                total: recipients.length,
                successful,
                failed,
            },
            details: results.map((result, index) => ({
                recipient: recipients[index],
                status: result.status === "fulfilled" ? result.value.status : "failed",
                error: result.status === "fulfilled"
                    ? result.value.error
                    : "Promise rejected",
            })),
        });
    }
    catch (error) {
        console.error("Error in sendBulkMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendBulkMessages = sendBulkMessages;
const getMessages = async (req, res) => {
    try {
        const { page = "1", limit = "10", status, direction, startDate, endDate, search, } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;
        let whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        if (direction) {
            whereClause.direction = direction;
        }
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
                { to: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { from: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { body: { [sequelize_1.Op.iLike]: `%${search}%` } },
            ];
        }
        const { count, rows: messages } = await twilioMessageModel_1.default.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: limitNum,
            offset,
        });
        res.json({
            messages: messages.map((message) => ({
                id: message.id,
                message_sid: message.message_sid,
                to: message.to,
                from: message.from,
                body: message.body,
                status: message.status,
                direction: message.direction,
                price: message.price,
                price_unit: message.price_unit,
                error_code: message.error_code,
                error_message: message.error_message,
                createdAt: message.createdAt,
            })),
            total: count,
            page: pageNum,
            pages: Math.ceil(count / limitNum),
        });
    }
    catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMessages = getMessages;
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await twilioMessageModel_1.default.findByPk(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json({
            id: message.id,
            message_sid: message.message_sid,
            to: message.to,
            from: message.from,
            body: message.body,
            status: message.status,
            direction: message.direction,
            price: message.price,
            price_unit: message.price_unit,
            error_code: message.error_code,
            error_message: message.error_message,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        });
    }
    catch (error) {
        console.error("Error in getMessageById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMessageById = getMessageById;
const getMessageStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let whereClause = {};
        if (startDate && endDate) {
            whereClause.createdAt = {
                [sequelize_1.Op.between]: [
                    new Date(startDate),
                    new Date(endDate),
                ],
            };
        }
        const totalMessages = await twilioMessageModel_1.default.count({ where: whereClause });
        const successfulMessages = await twilioMessageModel_1.default.count({
            where: { ...whereClause, status: "delivered" },
        });
        const failedMessages = await twilioMessageModel_1.default.count({
            where: { ...whereClause, status: "failed" },
        });
        const pendingMessages = await twilioMessageModel_1.default.count({
            where: { ...whereClause, status: "queued" },
        });
        const statusCounts = await twilioMessageModel_1.default.findAll({
            attributes: ["status", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"]],
            where: whereClause,
            group: ["status"],
            raw: true,
        });
        const dailyStats = await twilioMessageModel_1.default.findAll({
            attributes: [
                [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "date"],
                [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"],
            ],
            where: whereClause,
            group: [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt"))],
            order: [[(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "ASC"]],
            raw: true,
        });
        res.json({
            total: totalMessages,
            successful: successfulMessages,
            failed: failedMessages,
            pending: pendingMessages,
            success_rate: totalMessages > 0 ? (successfulMessages / totalMessages) * 100 : 0,
            status_counts: statusCounts,
            daily_stats: dailyStats,
        });
    }
    catch (error) {
        console.error("Error in getMessageStats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMessageStats = getMessageStats;
const handleTwilioWebhook = async (req, res) => {
    try {
        const { MessageSid, MessageStatus, To, From, ErrorCode, ErrorMessage } = req.body;
        if (MessageSid) {
            const errorCodeString = ErrorCode ? ErrorCode.toString() : null;
            await twilioMessageModel_1.default.update({
                status: MessageStatus,
                error_code: errorCodeString,
                error_message: ErrorMessage,
            }, { where: { message_sid: MessageSid } });
        }
        res.status(200).send("OK");
    }
    catch (error) {
        console.error("Error in handleTwilioWebhook:", error);
        res.status(500).send("Error");
    }
};
exports.handleTwilioWebhook = handleTwilioWebhook;
//# sourceMappingURL=twilioController.js.map