"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        // Get counter IDs
        const [counters] = (await queryInterface.sequelize.query("SELECT id FROM counters;"));
        const tickets = [];
        const showNames = [
            "Laser Show",
            "Water Show",
            "Light Show",
            "Dance Performance",
        ];
        const dropdownNames = ["Regular", "VIP", "Premium", "Standard"];
        // Generate tickets for the last 30 days
        for (let i = 0; i < 100; i++) {
            const randomCounter = counters[Math.floor(Math.random() * counters.length)];
            const randomDaysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - randomDaysAgo);
            tickets.push({
                price: Math.floor(Math.random() * 500) + 100,
                dropdown_name: dropdownNames[Math.floor(Math.random() * dropdownNames.length)],
                show_name: showNames[Math.floor(Math.random() * showNames.length)],
                counter_id: randomCounter.id,
                createdAt: createdAt,
                updatedAt: createdAt,
            });
        }
        await queryInterface.bulkInsert("tickets", tickets);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("tickets", {});
    },
};
//# sourceMappingURL=003-ticket-seeder.js.map