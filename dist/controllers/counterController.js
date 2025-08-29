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
exports.getCounters = exports.deleteCounter = exports.addCounter = void 0;
const counterModel_1 = __importDefault(require("../models/counterModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const counterSchema_1 = require("../schemas/counterSchema");
const addCounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = counterSchema_1.counterSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { username, password } = req.body;
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const counter = yield counterModel_1.default.create({
            username,
            password: hashedPassword,
        });
        res.status(201).json(counter);
    }
    catch (error) {
        console.error("Error in addCounter:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addCounter = addCounter;
const deleteCounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield counterModel_1.default.destroy({ where: { id } });
        res.json({ message: "Counter deleted" });
    }
    catch (error) {
        console.error("Error in deleteCounter:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCounter = deleteCounter;
const getCounters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counters = yield counterModel_1.default.findAll({
            attributes: { exclude: ["password"] }, // Don't return passwords
        });
        res.json(counters);
    }
    catch (error) {
        console.error("Error in getCounters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCounters = getCounters;
