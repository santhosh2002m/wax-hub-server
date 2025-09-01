"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopPerformers = exports.deleteUserGuide = exports.updateUserGuide = exports.createUserGuide = exports.getUserGuide = exports.getUserGuides = void 0;
const userGuideModel_1 = __importDefault(require("../models/userGuideModel"));
const userGuideSchema_1 = require("../schemas/userGuideSchema");
const sequelize_1 = require("sequelize");
const getUserGuides = async (req, res) => {
    try {
        const { search, status, vehicle_type } = req.query;
        let whereClause = {};
        if (search) {
            whereClause[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { number: { [sequelize_1.Op.iLike]: `%${search}%` } },
            ];
        }
        if (status) {
            whereClause.status = status;
        }
        if (vehicle_type) {
            whereClause.vehicle_type = vehicle_type;
        }
        const guides = await userGuideModel_1.default.findAll({
            where: whereClause,
            order: [["score", "DESC"]],
        });
        res.json({
            guides: guides.map((guide) => ({
                id: guide.id,
                name: guide.name,
                number: guide.number,
                vehicle_type: guide.vehicle_type,
                score: guide.score,
                total_bookings: guide.total_bookings,
                rating: guide.rating,
                status: guide.status,
                created_at: guide.created_at,
            })),
            total: guides.length,
        });
    }
    catch (error) {
        console.error("Error in get user guides:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserGuides = getUserGuides;
const getUserGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await userGuideModel_1.default.findByPk(id);
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }
        res.json({
            id: guide.id,
            name: guide.name,
            number: guide.number,
            vehicle_type: guide.vehicle_type,
            score: guide.score,
            total_bookings: guide.total_bookings,
            rating: guide.rating,
            status: guide.status,
            created_at: guide.created_at,
        });
    }
    catch (error) {
        console.error("Error in get user guide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserGuide = getUserGuide;
const createUserGuide = async (req, res) => {
    try {
        const { error } = userGuideSchema_1.userGuideSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { name, number, vehicle_type, score, total_bookings, rating, status, } = req.body;
        const existingGuide = await userGuideModel_1.default.findOne({ where: { number } });
        if (existingGuide) {
            return res
                .status(400)
                .json({ message: "Guide with this number already exists" });
        }
        const guide = await userGuideModel_1.default.create({
            name,
            number,
            vehicle_type,
            score: score || 0,
            total_bookings: total_bookings || 0,
            rating: rating || 0.0,
            status: status || "active",
            created_at: new Date(), // Explicitly set created_at
            updated_at: new Date(), // Explicitly set updated_at
        });
        res.status(201).json({
            message: "Guide created successfully",
            guide: {
                id: guide.id,
                name: guide.name,
                number: guide.number,
                vehicle_type: guide.vehicle_type,
                score: guide.score,
                total_bookings: guide.total_bookings,
                rating: guide.rating,
                status: guide.status,
                created_at: guide.created_at,
            },
        });
    }
    catch (error) {
        console.error("Error in create user guide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUserGuide = createUserGuide;
const updateUserGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = userGuideSchema_1.userGuideUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const guide = await userGuideModel_1.default.findByPk(id);
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }
        if (req.body.number && req.body.number !== guide.number) {
            const existingGuide = await userGuideModel_1.default.findOne({
                where: { number: req.body.number },
            });
            if (existingGuide) {
                return res
                    .status(400)
                    .json({ message: "Another guide with this number already exists" });
            }
        }
        await guide.update(req.body);
        res.json({
            message: "Guide updated successfully",
            guide: {
                id: guide.id,
                name: guide.name,
                number: guide.number,
                vehicle_type: guide.vehicle_type,
                score: guide.score,
                total_bookings: guide.total_bookings,
                rating: guide.rating,
                status: guide.status,
                updated_at: guide.updated_at,
            },
        });
    }
    catch (error) {
        console.error("Error in update user guide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUserGuide = updateUserGuide;
const deleteUserGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await userGuideModel_1.default.findByPk(id);
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }
        await guide.destroy();
        res.json({ message: "Guide deleted successfully" });
    }
    catch (error) {
        console.error("Error in delete user guide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUserGuide = deleteUserGuide;
const getTopPerformers = async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        const topPerformers = await userGuideModel_1.default.findAll({
            where: { status: "active" },
            order: [["score", "DESC"]],
            limit: parseInt(limit) || 3,
        });
        res.json({
            top_performers: topPerformers.map((guide) => ({
                id: guide.id,
                name: guide.name,
                number: guide.number,
                vehicle_type: guide.vehicle_type,
                score: guide.score,
                total_bookings: guide.total_bookings,
                rating: guide.rating,
                rank: topPerformers.indexOf(guide) + 1,
            })),
        });
    }
    catch (error) {
        console.error("Error in get top performers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTopPerformers = getTopPerformers;
//# sourceMappingURL=userGuideController.js.map