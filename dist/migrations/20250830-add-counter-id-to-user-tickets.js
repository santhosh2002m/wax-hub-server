"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDescription = await queryInterface.describeTable("user_tickets");
        if (!tableDescription.counter_id) {
            await queryInterface.addColumn("user_tickets", "counter_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "counters", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
            console.log("Column counter_id added to user_tickets");
        }
        else {
            console.log("Column counter_id already exists in user_tickets, skipping addition");
        }
    },
    down: async (queryInterface) => {
        const tableDescription = await queryInterface.describeTable("user_tickets");
        if (tableDescription.counter_id) {
            await queryInterface.removeColumn("user_tickets", "counter_id");
            console.log("Column counter_id removed from user_tickets");
        }
        else {
            console.log("Column counter_id does not exist in user_tickets, skipping removal");
        }
    },
};
//# sourceMappingURL=20250830-add-counter-id-to-user-tickets.js.map