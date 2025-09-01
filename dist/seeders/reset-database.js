"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const resetDatabase = async () => {
    try {
        await database_1.default.authenticate();
        console.log("Database connected");
        // Drop all tables (be careful - this will delete all data!)
        await database_1.default.drop();
        console.log("All tables dropped");
        // Recreate tables by syncing
        await database_1.default.sync({ force: true });
        console.log("All tables recreated");
        console.log("✅ Database reset successfully!");
    }
    catch (err) {
        console.error("💥 Database reset error:", err);
        process.exit(1);
    }
};
resetDatabase().then(() => {
    process.exit(0);
});
//# sourceMappingURL=reset-database.js.map