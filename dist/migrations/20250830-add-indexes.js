"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.addIndex("user_tickets", ["createdAt"]);
        await queryInterface.addIndex("user_tickets", ["invoice_no"]);
        await queryInterface.addIndex("user_tickets", ["guide_name"]);
        await queryInterface.addIndex("user_tickets", ["guide_number"]);
        await queryInterface.addIndex("user_tickets", ["user_id"]);
        await queryInterface.addIndex("tickets", ["createdAt"]);
        await queryInterface.addIndex("tickets", ["counter_id"]);
        await queryInterface.addIndex("transactions", ["ticket_id"]);
        await queryInterface.addIndex("transactions", ["counter_id"]);
        await queryInterface.addIndex("transactions", ["createdAt"]);
    },
    down: async (queryInterface) => {
        await queryInterface.removeIndex("user_tickets", ["createdAt"]);
        await queryInterface.removeIndex("user_tickets", ["invoice_no"]);
        await queryInterface.removeIndex("user_tickets", ["guide_name"]);
        await queryInterface.removeIndex("user_tickets", ["guide_number"]);
        await queryInterface.removeIndex("user_tickets", ["user_id"]);
        await queryInterface.removeIndex("tickets", ["createdAt"]);
        await queryInterface.removeIndex("tickets", ["counter_id"]);
        await queryInterface.removeIndex("transactions", ["ticket_id"]);
        await queryInterface.removeIndex("transactions", ["counter_id"]);
        await queryInterface.removeIndex("transactions", ["createdAt"]);
    },
};
//# sourceMappingURL=20250830-add-indexes.js.map