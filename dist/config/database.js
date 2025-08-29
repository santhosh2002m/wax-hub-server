"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validate environment variables
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
}
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
        ssl: process.env.NODE_ENV === "production"
            ? {
                require: true,
                rejectUnauthorized: false,
            }
            : false,
    },
});
exports.default = sequelize;
