"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuide = exports.updateGuide = exports.addGuide = exports.getGuides = void 0;
const userGuideModel_1 = __importDefault(require("../models/userGuideModel"));
const guideSchema_1 = require("../schemas/guideSchema");
const getGuides = async (req, res) => {
    try {
        const guides = await userGuideModel_1.default.findAll();
        res.json(guides);
    }
    catch (error) {
        console.error("Error in getGuides:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getGuides = getGuides;
const addGuide = async (req, res) => {
    try {
        const { error } = guideSchema_1.guideSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const guide = await userGuideModel_1.default.create(req.body);
        res.status(201).json(guide);
    }
    catch (error) {
        console.error("Error in addGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addGuide = addGuide;
const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = guideSchema_1.guideSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const guide = await userGuideModel_1.default.findByPk(id);
        if (!guide)
            return res.status(404).json({ message: "Guide not found" });
        await userGuideModel_1.default.update(req.body, { where: { id } });
        res.json({ message: "Guide updated" });
    }
    catch (error) {
        console.error("Error in updateGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateGuide = updateGuide;
const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await userGuideModel_1.default.findByPk(id);
        if (!guide)
            return res.status(404).json({ message: "Guide not found" });
        await userGuideModel_1.default.destroy({ where: { id } });
        res.json({ message: "Guide deleted" });
    }
    catch (error) {
        console.error("Error in deleteGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteGuide = deleteGuide;
//# sourceMappingURL=guideController.js.map