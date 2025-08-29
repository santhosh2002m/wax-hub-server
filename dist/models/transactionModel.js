"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ticketModel_1 = __importDefault(require("./ticketModel"));
const counterModel_1 = __importDefault(require("./counterModel"));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    invoice_no: {
        type: sequelize_1.DataTypes.STRING(50),
        unique: true,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    adult_count: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    },
    total_paid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ticket_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: ticketModel_1.default,
            key: "id",
        },
    },
    counter_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: counterModel_1.default,
            key: "id",
        },
    },
}, {
    sequelize: database_1.default,
    modelName: "Transaction",
    tableName: "Transactions",
});
// Associations
Transaction.belongsTo(ticketModel_1.default, { foreignKey: "ticket_id", as: "ticket" });
Transaction.belongsTo(counterModel_1.default, { foreignKey: "counter_id", as: "counter" });
exports.default = Transaction;
