"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("transactions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            invoice_no: { type: Sequelize.STRING, allowNull: false, unique: true },
            date: { type: Sequelize.DATE, allowNull: false },
            adult_count: { type: Sequelize.INTEGER, allowNull: false },
            child_count: { type: Sequelize.INTEGER, allowNull: false },
            category: { type: Sequelize.STRING, allowNull: false },
            total_paid: { type: Sequelize.FLOAT, allowNull: false },
            ticket_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "tickets", key: "id" },
            },
            counter_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "counters", key: "id" },
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("transactions");
    },
};
//# sourceMappingURL=20240826-create-transaction.js.map