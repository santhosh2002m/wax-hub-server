"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class TwilioMessage extends sequelize_1.Model {
}
TwilioMessage.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    message_sid: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    to: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    from: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    body: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    direction: {
        type: sequelize_1.DataTypes.ENUM("outbound-api", "inbound"),
        allowNull: false,
    },
    price: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    price_unit: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    error_code: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    error_message: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "TwilioMessage",
    tableName: "twilio_messages",
    timestamps: true,
});
exports.default = TwilioMessage;
//# sourceMappingURL=twilioMessageModel.js.map