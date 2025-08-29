import sequelize from "./config/database";
import User from "./models/userModel";
import UserTicket from "./models/userticketModel";
import bcrypt from "bcryptjs";

const seedUserDatabase = async () => {
  try {
    // Sync the database, dropping all tables and recreating them
    await sequelize.sync({ force: true });

    // Create sample users
    const users = [
      {
        username: "ticketadmin",
        password: bcrypt.hashSync("admin123", 10),
        role: "admin" as const,
      },
      {
        username: "ticketuser1",
        password: bcrypt.hashSync("user123", 10),
        role: "ticket_manager" as const,
      },
      {
        username: "ticketuser2",
        password: bcrypt.hashSync("user123", 10),
        role: "ticket_manager" as const,
      },
    ];

    const createdUsers = await User.bulkCreate(users);

    // Create sample tickets
    const tickets = [
      {
        invoice_no: "TKT0001",
        vehicle_type: "guide",
        guide_name: "Rahman",
        guide_number: "9019296034",
        show_name: "Celebrity Wax Museum",
        adults: 4,
        ticket_price: 150,
        total_price: 600,
        tax: 7.67,
        final_amount: 646,
        status: "completed" as const,
        user_id: createdUsers[1].id,
        createdAt: new Date("2024-01-15"),
      },
      {
        invoice_no: "TKT0002",
        vehicle_type: "big car",
        guide_name: "Loki",
        guide_number: "9380320892",
        show_name: "Horror Show",
        adults: 6,
        ticket_price: 85,
        total_price: 510,
        tax: 7.45,
        final_amount: 548,
        status: "completed" as const,
        user_id: createdUsers[2].id,
        createdAt: new Date("2024-01-14"),
      },
    ];

    await UserTicket.bulkCreate(tickets);

    console.log("User database seeded successfully");
  } catch (error) {
    console.error("Error seeding user database:", error);
  } finally {
    await sequelize.close();
  }
};

seedUserDatabase();
