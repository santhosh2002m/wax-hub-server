"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("user_guides", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            number: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            vehicle_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            score: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            total_bookings: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            rating: {
                type: Sequelize.DECIMAL(3, 1),
                defaultValue: 0.0,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "active",
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("user_guides");
    },
};
//# sourceMappingURL=20250101-create-user-guides.js.map