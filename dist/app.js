"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = require("./utils/connectDB");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const counterRoutes_1 = __importDefault(require("./routes/counterRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const guideRoutes_1 = __importDefault(require("./routes/guideRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = require("fs");
const path_1 = require("path");
const database_1 = __importDefault(require("./config/database"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Error: Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to database and run migrations
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)();
        console.log("Database connected");
        const migrationsPath = (0, path_1.join)(__dirname, "migrations");
        const files = (0, fs_1.readdirSync)(migrationsPath)
            .filter((f) => f.endsWith(".ts") && f !== "run-migrations.ts")
            .sort();
        for (const file of files) {
            const migration = yield Promise.resolve(`${(0, path_1.join)(migrationsPath, file)}`).then(s => __importStar(require(s)));
            console.log(`Running migration: ${file}`);
            yield migration.up(database_1.default.getQueryInterface(), sequelize_1.DataTypes);
        }
        console.log("All migrations completed!");
    }
    catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
});
runMigrations().then(() => {
    // Routes
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/counters", counterRoutes_1.default);
    app.use("/api/tickets", ticketRoutes_1.default);
    app.use("/api/guides", guideRoutes_1.default);
    app.use("/api/analytics", analyticsRoutes_1.default);
    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.json({ status: "OK", message: "Server is running" });
    });
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: "Something went wrong!" });
    });
    // 404 handler
    app.use("*", (req, res) => {
        res.status(404).json({ message: "Route not found" });
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
