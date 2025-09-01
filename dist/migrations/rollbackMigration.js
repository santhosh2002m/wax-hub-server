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
const path_1 = require("path");
const fs_1 = require("fs");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const migrationsDir = __dirname;
const runRollback = async () => {
    try {
        const files = (0, fs_1.readdirSync)(migrationsDir)
            .filter((f) => (f.endsWith(".ts") || f.endsWith(".js")) &&
            f !== "run-migrations.ts" &&
            f !== "rollbackMigration.ts")
            .sort()
            .reverse();
        for (const file of files) {
            console.log(`Rolling back migration: ${file}`);
            const migration = await Promise.resolve(`${(0, path_1.join)(migrationsDir, file)}`).then(s => __importStar(require(s)));
            if (migration.down) {
                await migration.down(database_1.default.getQueryInterface(), sequelize_1.DataTypes);
                console.log(`Migration ${file} rolled back successfully!`);
            }
            else {
                console.warn(`⚠️ No "down" function found in ${file}`);
            }
        }
        console.log("✅ All migrations rolled back!");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error during rollback:", err);
        process.exit(1);
    }
};
runRollback();
//# sourceMappingURL=rollbackMigration.js.map