"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const counterModel_1 = __importDefault(require("./counterModel"));
const ticketModel_1 = __importDefault(require("./ticketModel"));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_no: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    adult_count: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    child_count: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    total_paid: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    ticket_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    counter_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: true,
});
Transaction.belongsTo(ticketModel_1.default, { foreignKey: "ticket_id", as: "ticket" });
Transaction.belongsTo(counterModel_1.default, { foreignKey: "counter_id", as: "counter" });
exports.default = Transaction;
//# sourceMappingURL=transactionModel.js.map