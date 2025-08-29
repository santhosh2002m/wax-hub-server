import sequelize from "./config/database";
import Counter, { CounterCreationAttributes } from "./models/counterModel";
import Ticket, { TicketCreationAttributes } from "./models/ticketModel";
import Transaction from "./models/transactionModel";
import Guide from "./models/guideModel";
import Message, { MessageCreationAttributes } from "./models/messageModel"; // Add this import
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
  try {
    // Explicitly drop the ENUM types with CASCADE to handle dependencies
    await sequelize.query(
      'DROP TYPE IF EXISTS "public"."enum_Transactions_category" CASCADE;'
    );
    await sequelize.query(
      'DROP TYPE IF EXISTS "public"."enum_Tickets_category" CASCADE;'
    );
    await sequelize.query(
      'DROP TYPE IF EXISTS "public"."enum_Messages_status" CASCADE;'
    ); // Add this for Messages enum

    // Sync the database, dropping all tables and recreating them
    await sequelize.sync({ force: true });

    const counters: CounterCreationAttributes[] = [
      {
        username: "admin1",
        password: bcrypt.hashSync("adminpass123", 10),
        role: "admin",
      },
      {
        username: "manager1",
        password: bcrypt.hashSync("managerpass456", 10),
        role: "manager",
      },
      {
        username: "admin2",
        password: bcrypt.hashSync("adminpass789", 10),
        role: "admin",
      },
      {
        username: "manager2",
        password: bcrypt.hashSync("managerpass101", 10),
        role: "manager",
      },
      {
        username: "admin3",
        password: bcrypt.hashSync("adminpass202", 10),
        role: "admin",
      },
      {
        username: "manager3",
        password: bcrypt.hashSync("managerpass303", 10),
        role: "manager",
      },
      {
        username: "admin4",
        password: bcrypt.hashSync("adminpass404", 10),
        role: "admin",
      },
      {
        username: "manager4",
        password: bcrypt.hashSync("managerpass505", 10),
        role: "manager",
      },
    ];
    const createdCounters = await Counter.bulkCreate(counters);

    const tickets: TicketCreationAttributes[] = [
      {
        price: 100,
        ticket_type: "General Admission",
        show_name: "Roller Coaster Ride",
        category: "Adult",
        createdAt: new Date("2025-08-27T03:30:00Z"), // 9:00 AM IST
      },
      {
        price: 150,
        ticket_type: "VIP Admission",
        show_name: "Ferris Wheel",
        category: "Adult",
        createdAt: new Date("2025-08-27T04:30:00Z"), // 10:00 AM IST
      },
      {
        price: 80,
        ticket_type: "Child Ticket",
        show_name: "Merry-Go-Round",
        category: "Child",
        createdAt: new Date("2025-08-27T05:30:00Z"), // 11:00 AM IST
      },
      {
        price: 200,
        ticket_type: "Premium Pass",
        show_name: "Haunted House",
        category: "Group",
        createdAt: new Date("2025-08-27T06:30:00Z"), // 12:00 PM IST
      },
      {
        price: 120,
        ticket_type: "Family Pack",
        show_name: "Water Slide",
        category: "Group",
        createdAt: new Date("2025-08-27T07:30:00Z"), // 1:00 PM IST
      },
      {
        price: 90,
        ticket_type: "Senior Ticket",
        show_name: "Bumper Cars",
        category: "Senior",
        createdAt: new Date("2025-08-27T08:30:00Z"), // 2:00 PM IST
      },
      {
        price: 180,
        ticket_type: "Group Discount",
        show_name: "Sky Tower",
        category: "Group",
        createdAt: new Date("2025-08-27T09:30:00Z"), // 3:00 PM IST
      },
      {
        price: 130,
        ticket_type: "Evening Pass",
        show_name: "Laser Show",
        category: "Adult",
        createdAt: new Date("2025-08-27T10:30:00Z"), // 4:00 PM IST
      },
      {
        price: 120,
        ticket_type: "Family Pack",
        show_name: "Water Slide",
        category: "Group",
        createdAt: new Date("2025-08-26T11:30:00Z"), // Previous day
      },
      {
        price: 120,
        ticket_type: "Family Pack",
        show_name: "Water Slide",
        category: "Group",
        createdAt: new Date("2025-08-25T11:30:00Z"), // Two days ago
      },
      {
        price: 100,
        ticket_type: "General Admission",
        show_name: "Roller Coaster Ride",
        category: "Adult",
        createdAt: new Date("2025-01-15T04:30:00Z"), // Jan 15
      },
      {
        price: 150,
        ticket_type: "VIP Admission",
        show_name: "Ferris Wheel",
        category: "Adult",
        createdAt: new Date("2025-02-20T06:30:00Z"), // Feb 20
      },
      {
        price: 100,
        ticket_type: "General Admission",
        show_name: "Roller Coaster Ride",
        category: "Adult",
        createdAt: new Date("2025-03-10T04:30:00Z"), // Mar 10
      },
      {
        price: 200,
        ticket_type: "Premium Pass",
        show_name: "Haunted House",
        category: "Group",
        createdAt: new Date("2025-04-15T04:30:00Z"), // Apr 15
      },
      {
        price: 120,
        ticket_type: "Family Pack",
        show_name: "Water Slide",
        category: "Group",
        createdAt: new Date("2025-05-20T04:30:00Z"), // May 20
      },
      {
        price: 120,
        ticket_type: "Family Pack",
        show_name: "Water Slide",
        category: "Group",
        createdAt: new Date("2025-06-10T04:30:00Z"), // Jun 10
      },
      {
        price: 200,
        ticket_type: "Premium Pass",
        show_name: "Haunted House",
        category: "Group",
        createdAt: new Date("2025-07-15T04:30:00Z"), // Jul 15
      },
      {
        price: 100,
        ticket_type: "General Admission",
        show_name: "Roller Coaster Ride",
        category: "Adult",
        createdAt: new Date("2025-08-01T04:30:00Z"), // Aug 1
      },
    ];
    const createdTickets = await Ticket.bulkCreate(tickets);

    // Create transactions for each ticket
    const transactions = createdTickets.map((ticket, index) => ({
      invoice_no: `TICKET${ticket.id.toString().padStart(4, "0")}`,
      date: ticket.createdAt,
      adult_count: ticket.category === "Adult" ? 1 : 0,
      child_count: ticket.category === "Child" ? 1 : 0,
      category: ticket.category,
      total_paid: ticket.price,
      ticket_id: ticket.id,
      counter_id: createdCounters[index % createdCounters.length].id,
    }));
    await Transaction.bulkCreate(transactions);

    const guides = [
      { name: "John Doe", number: "1234567890", vehicle_type: "Van", score: 5 },
      {
        name: "Jane Smith",
        number: "0987654321",
        vehicle_type: "Bus",
        score: 4,
      },
      {
        name: "Mike Johnson",
        number: "1112223334",
        vehicle_type: "Car",
        score: 3,
      },
      {
        name: "Sarah Williams",
        number: "4445556667",
        vehicle_type: "Van",
        score: 5,
      },
      {
        name: "Robert Brown",
        number: "7778889990",
        vehicle_type: "Bus",
        score: 4,
      },
      {
        name: "Emily Davis",
        number: "2223334445",
        vehicle_type: "Jeep",
        score: 4,
      },
      {
        name: "David Wilson",
        number: "5556667778",
        vehicle_type: "Car",
        score: 3,
      },
      {
        name: "Lisa Taylor",
        number: "8889990001",
        vehicle_type: "Van",
        score: 5,
      },
    ];
    await Guide.bulkCreate(guides);

    // Add sample messages with explicit typing
    const messages: MessageCreationAttributes[] = [
      {
        phone: "+1234567890",
        message: "Welcome to our amusement park!",
        status: "sent",
        sentAt: new Date("2025-08-27T10:00:00Z"),
        counter_id: createdCounters[0].id,
      },
      {
        phone: "+0987654321",
        message: "Your ticket has been confirmed!",
        status: "sent",
        sentAt: new Date("2025-08-27T11:00:00Z"),
        counter_id: createdCounters[1].id,
      },
      {
        phone: "+1112223334",
        message: "Reminder: Visit us tomorrow!",
        status: "pending",
        counter_id: createdCounters[2].id,
      },
    ];
    await Message.bulkCreate(messages);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
