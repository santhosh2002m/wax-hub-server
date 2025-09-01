"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/messageModel.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const counterModel_1 = __importDefault(require("./counterModel"));
class Message extends sequelize_1.Model {
}
Message.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT, // Changed to TEXT to match migration
        allowNull: false,
    },
    counter_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "counters",
            key: "id",
        },
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: "Message",
    tableName: "messages",
    timestamps: true,
});
Message.belongsTo(counterModel_1.default, { foreignKey: "counter_id", as: "counter" });
exports.default = Message;
//# sourceMappingURL=messageModel.js.map