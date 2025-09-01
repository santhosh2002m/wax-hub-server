"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableExists = await queryInterface.tableExists("tickets");
        if (!tableExists) {
            console.log("Table tickets does not exist, skipping operation");
            return;
        }
        const tableDescription = await queryInterface.describeTable("tickets");
        if (!tableDescription.is_analytics) {
            await queryInterface.addColumn("tickets", "is_analytics", {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            });
            console.log("Column is_analytics added to tickets table");
        }
        else {
            console.log("Column is_analytics already exists, skipping addition");
        }
    },
    down: async (queryInterface) => {
        const tableExists = await queryInterface.tableExists("tickets");
        if (!tableExists) {
            console.log("Table tickets does not exist, skipping operation");
            return;
        }
        const tableDescription = await queryInterface.describeTable("tickets");
        if (tableDescription.is_analytics) {
            await queryInterface.removeColumn("tickets", "is_analytics");
            console.log("Column is_analytics removed from tickets table");
        }
        else {
            console.log("Column is_analytics does not exist, skipping removal");
        }
    },
};
//# sourceMappingURL=20250101-add-is-analytics-to-tickets.js.map