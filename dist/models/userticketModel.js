"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTicket = void 0;
// src/models/userticketModel.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const counterModel_1 = __importDefault(require("./counterModel"));
class UserTicket extends sequelize_1.Model {
}
exports.UserTicket = UserTicket;
UserTicket.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_no: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    vehicle_type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    guide_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    guide_number: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    show_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    adults: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    ticket_price: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    total_price: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    tax: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    final_amount: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
    },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    counter_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "UserTicket",
    tableName: "user_tickets",
    timestamps: true,
    underscored: false,
});
UserTicket.belongsTo(counterModel_1.default, { foreignKey: "counter_id", as: "counter" });
exports.default = UserTicket;
//# sourceMappingURL=userticketModel.js.map