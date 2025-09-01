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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// FILE: seeders/run-seeders.ts (updated)
const path_1 = require("path");
const fs_1 = require("fs");
const database_1 = __importDefault(require("../config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const runSeeders = async () => {
    try {
        await database_1.default.authenticate();
        console.log("Database connected");
        const seedersPath = (0, path_1.join)(__dirname);
        const files = (0, fs_1.readdirSync)(seedersPath)
            .filter((f) => f.endsWith(".ts") &&
            f !== "run-seeders.ts" &&
            f !== "reset-database.ts") // Exclude reset-database.ts
            .sort();
        for (const file of files) {
            try {
                const seeder = await Promise.resolve(`${(0, path_1.join)(seedersPath, file)}`).then(s => __importStar(require(s)));
                console.log(`Running seeder: ${file}`);
                await seeder.up(database_1.default.getQueryInterface());
                console.log(`✅ Seeder ${file} completed successfully`);
            }
            catch (err) {
                console.error(`❌ Seeder error for ${file}:`, err.message);
                if (err.name === "SequelizeUniqueConstraintError") {
                    console.log("Skipping due to duplicate data...");
                    continue; // Skip to next seeder
                }
                throw err;
            }
        }
        console.log("🎉 All seeders completed successfully!");
    }
    catch (err) {
        console.error("💥 Seeder error:", err);
        process.exit(1);
    }
};
runSeeders().then(() => {
    process.exit(0);
});
//# sourceMappingURL=run-seeders.js.map