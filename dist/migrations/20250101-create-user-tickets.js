"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("user_tickets", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            invoice_no: { type: Sequelize.STRING, allowNull: false, unique: true },
            vehicle_type: { type: Sequelize.STRING, allowNull: false },
            guide_name: { type: Sequelize.STRING, allowNull: false },
            guide_number: { type: Sequelize.STRING, allowNull: false },
            show_name: { type: Sequelize.STRING, allowNull: false },
            adults: { type: Sequelize.INTEGER, allowNull: false },
            ticket_price: { type: Sequelize.FLOAT, allowNull: false },
            total_price: { type: Sequelize.FLOAT, allowNull: false },
            tax: { type: Sequelize.FLOAT, allowNull: false },
            final_amount: { type: Sequelize.FLOAT, allowNull: false },
            status: {
                type: Sequelize.ENUM("pending", "completed", "cancelled"),
                defaultValue: "pending",
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "counters", key: "id" },
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("user_tickets");
    },
};
//# sourceMappingURL=20250101-create-user-tickets.js.map