"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Guide extends sequelize_1.Model {
}
Guide.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    number: {
        type: sequelize_1.DataTypes.STRING(20),
        unique: true,
    },
    vehicle_type: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    modelName: "Guide",
    tableName: "Guides",
});
exports.default = Guide;
