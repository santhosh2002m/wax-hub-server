"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const database_1 = __importDefault(require("../config/database"));
const connectDB = async () => {
    try {
        await database_1.default.authenticate();
        console.log("PostgreSQL connected successfully");
        // Sync models in development
        if (process.env.NODE_ENV === "development") {
            await database_1.default.sync({ force: false });
            console.log("Database synced");
        }
    }
    catch (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=connectDB.js.map