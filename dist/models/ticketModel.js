"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// FILE: models/ticketModel.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const counterModel_1 = __importDefault(require("./counterModel"));
class Ticket extends sequelize_1.Model {
}
Ticket.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    dropdown_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    show_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    counter_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    is_analytics: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "Ticket",
    tableName: "tickets",
    timestamps: true,
});
Ticket.belongsTo(counterModel_1.default, { foreignKey: "counter_id", as: "counter" });
exports.default = Ticket;
//# sourceMappingURL=ticketModel.js.map