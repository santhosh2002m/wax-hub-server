"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("tickets", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            price: { type: Sequelize.FLOAT, allowNull: false },
            dropdown_name: { type: Sequelize.STRING, allowNull: false },
            show_name: { type: Sequelize.STRING, allowNull: false },
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
        await queryInterface.dropTable("tickets");
    },
};
//# sourceMappingURL=20240826-create-ticket.js.map