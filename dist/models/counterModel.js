"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/counterModel.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Counter extends sequelize_1.Model {
}
Counter.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: sequelize_1.DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    role: {
        type: sequelize_1.DataTypes.ENUM("manager", "admin", "user"), // Updated ENUM
        defaultValue: "manager",
        allowNull: false,
    },
    special: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "Counter",
    tableName: "counters",
    timestamps: true,
    underscored: false,
});
exports.default = Counter;
//# sourceMappingURL=counterModel.js.map