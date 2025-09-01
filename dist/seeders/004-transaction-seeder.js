"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        // Get tickets and counters
        const [tickets] = (await queryInterface.sequelize.query('SELECT id, price, "createdAt" FROM tickets;' // Fixed: use quotes for case-sensitive column name
        ));
        const [counters] = (await queryInterface.sequelize.query("SELECT id FROM counters;"));
        const transactions = [];
        const categories = ["Adult", "Child", "Senior", "Group", "Special"];
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const randomCounter = counters[Math.floor(Math.random() * counters.length)];
            transactions.push({
                invoice_no: `INV${1000 + i}`,
                date: ticket.createdAt, // Fixed: changed createdat to createdAt
                adult_count: Math.floor(Math.random() * 5) + 1,
                child_count: Math.floor(Math.random() * 3),
                category: categories[Math.floor(Math.random() * categories.length)],
                total_paid: ticket.price,
                ticket_id: ticket.id,
                counter_id: randomCounter.id,
                createdAt: ticket.createdAt, // Fixed: changed createdat to createdAt
                updatedAt: ticket.createdAt, // Fixed: changed createdat to createdAt
            });
        }
        await queryInterface.bulkInsert("transactions", transactions);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("transactions", {});
    },
};
//# sourceMappingURL=004-transaction-seeder.js.map