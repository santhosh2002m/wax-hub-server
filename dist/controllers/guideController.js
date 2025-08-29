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
exports.deleteGuide = exports.updateGuide = exports.addGuide = exports.getGuides = void 0;
const guideModel_1 = __importDefault(require("../models/guideModel"));
const guideSchema_1 = require("../schemas/guideSchema");
const getGuides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guides = yield guideModel_1.default.findAll();
        res.json(guides);
    }
    catch (error) {
        console.error("Error in getGuides:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getGuides = getGuides;
const addGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = guideSchema_1.guideSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const guide = yield guideModel_1.default.create(req.body);
        res.status(201).json(guide);
    }
    catch (error) {
        console.error("Error in addGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addGuide = addGuide;
const updateGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = guideSchema_1.guideSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        yield guideModel_1.default.update(req.body, { where: { id } });
        res.json({ message: "Guide updated" });
    }
    catch (error) {
        console.error("Error in updateGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateGuide = updateGuide;
const deleteGuide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield guideModel_1.default.destroy({ where: { id } });
        res.json({ message: "Guide deleted" });
    }
    catch (error) {
        console.error("Error in deleteGuide:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteGuide = deleteGuide;
