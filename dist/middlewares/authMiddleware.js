"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeSpecialCounter = exports.authorizeAdminOrManager = exports.authorizeAdminOrUser = exports.authorizeUser = exports.authorizeManager = exports.authorizeAdmin = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateJWT = authenticateJWT;
const authorizeAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
const authorizeManager = (req, res, next) => {
    const user = req.user;
    if (user.role === "manager" || user.role === "admin" || user.special) {
        return next();
    }
    return res
        .status(403)
        .json({ message: "Manager, admin, or special counter access required" });
};
exports.authorizeManager = authorizeManager;
const authorizeUser = (req, res, next) => {
    const user = req.user;
    if (user.role !== "user" && user.role !== "admin" && !user.special) {
        return res
            .status(403)
            .json({ message: "User, admin, or special counter access required" });
    }
    next();
};
exports.authorizeUser = authorizeUser;
const authorizeAdminOrUser = (req, res, next) => {
    const user = req.user;
    if (user.role !== "admin" && user.role !== "user" && !user.special) {
        return res
            .status(403)
            .json({ message: "Admin, user, or special counter access required" });
    }
    next();
};
exports.authorizeAdminOrUser = authorizeAdminOrUser;
const authorizeAdminOrManager = (req, res, next) => {
    const user = req.user;
    if (user.role === "admin" || user.role === "manager" || user.special) {
        return next();
    }
    return res
        .status(403)
        .json({ message: "Admin, manager, or special counter access required" });
};
exports.authorizeAdminOrManager = authorizeAdminOrManager;
// NEW: Special counter authorization
const authorizeSpecialCounter = (req, res, next) => {
    const user = req.user;
    if (user.special || user.role === "admin") {
        return next();
    }
    return res
        .status(403)
        .json({ message: "Special counter or admin access required" });
};
exports.authorizeSpecialCounter = authorizeSpecialCounter;
//# sourceMappingURL=authMiddleware.js.map