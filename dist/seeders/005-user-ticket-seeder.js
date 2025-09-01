"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        // Clear existing data first
        await queryInterface.bulkDelete("user_tickets", {});
        // Get user counters
        const [userCounters] = (await queryInterface.sequelize.query("SELECT id FROM counters WHERE role = 'user';"));
        const userTickets = [];
        const guideNames = [
            "Rajesh Kumar",
            "Suresh Patel",
            "Mohammed Ali",
            "Anil Sharma",
        ];
        for (let i = 0; i < 20; i++) {
            const randomCounter = userCounters[Math.floor(Math.random() * userCounters.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - daysAgo);
            const adults = Math.floor(Math.random() * 10) + 1;
            const ticketPrice = 200;
            const totalPrice = adults * ticketPrice;
            const tax = totalPrice * 0.18;
            const finalAmount = totalPrice + tax;
            userTickets.push({
                invoice_no: `TKT${1000 + i}`,
                vehicle_type: ["Car", "Van", "Bus"][Math.floor(Math.random() * 3)],
                guide_name: guideNames[Math.floor(Math.random() * guideNames.length)],
                guide_number: `+91987654${3000 + i}`,
                show_name: ["Laser Show", "Water Show"][Math.floor(Math.random() * 2)],
                adults: adults,
                ticket_price: ticketPrice,
                total_price: totalPrice,
                tax: tax,
                final_amount: finalAmount,
                status: "completed",
                user_id: randomCounter.id,
                counter_id: randomCounter.id,
                createdAt: createdAt,
                updatedAt: createdAt,
            });
        }
        await queryInterface.bulkInsert("user_tickets", userTickets);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("user_tickets", {});
    },
};
//# sourceMappingURL=005-user-ticket-seeder.js.map