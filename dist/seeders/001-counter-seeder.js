"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
module.exports = {
    up: async (queryInterface) => {
        const hashedPassword = bcryptjs_1.default.hashSync("admin123", 10);
        // First, check if counters already exist and delete them
        await queryInterface.bulkDelete("counters", {});
        await queryInterface.bulkInsert("counters", [
            {
                username: "admin",
                password: hashedPassword,
                role: "admin",
                special: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "manager1",
                password: hashedPassword,
                role: "manager",
                special: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "user1",
                password: hashedPassword,
                role: "user",
                special: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "special_counter",
                password: hashedPassword,
                role: "user",
                special: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("counters", {});
    },
};
//# sourceMappingURL=001-counter-seeder.js.map