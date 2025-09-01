"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("messages", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            message: { type: Sequelize.TEXT, allowNull: false },
            counter_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "counters", key: "id" },
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("messages");
    },
};
//# sourceMappingURL=20250828-create-messages.js.map