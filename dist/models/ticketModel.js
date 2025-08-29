"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ticket extends sequelize_1.Model {
}
Ticket.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    dropdown_name: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    show_name: {
        type: sequelize_1.DataTypes.STRING(100),
    },
}, {
    sequelize: database_1.default,
    modelName: "Ticket",
    tableName: "Tickets",
});
exports.default = Ticket;
