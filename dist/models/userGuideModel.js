"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class UserGuide extends sequelize_1.Model {
}
UserGuide.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A",
    },
    vehicle_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Unknown",
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    total_bookings: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "active",
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    modelName: "UserGuide",
    tableName: "user_guides",
    timestamps: true,
    underscored: true,
});
exports.default = UserGuide;
//# sourceMappingURL=userGuideModel.js.map