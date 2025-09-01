// Helper function to update guide stats or create guide if not exists
// FILE: controllers/userTicketController.ts
import { Request, Response } from "express";
import UserTicket from "../models/userticketModel";
import { userTicketSchema } from "../schemas/userSchema";
import { Op } from "sequelize";
import Ticket from "../models/ticketModel";
import Transaction from "../models/transactionModel";
import UserGuide from "../models/userGuideModel";
import Counter from "../models/counterModel";
import { v4 as uuidv4 } from "uuid";

// Helper function to update guide stats or create guide if not exists
const updateGuideStats = async (guide_name: string, adults: number) => {
  if (guide_name && guide_name !== "N/A") {
    let guide = await UserGuide.findOne({ where: { name: guide_name } });

    if (!guide) {
      // Create a new guide if it doesn't exist
      guide = await UserGuide.create({
        name: guide_name,
        number: "N/A",
        vehicle_type: "Unknown",
        score: 0,
        total_bookings: 0,
        rating: 0.0,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Update the guide's stats
    guide.total_bookings += adults;
    guide.score = guide.total_bookings * 10;
    await guide.save();
  }
};

const generateUniqueInvoiceNo = async (
  prefix: string = "TKT"
): Promise<string> => {
  let invoiceNo: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    invoiceNo = `${prefix}${uuidv4().slice(0, 8).toUpperCase()}`;

    // Check if invoice number already exists
    const existingTicket = await UserTicket.findOne({
      where: { invoice_no: invoiceNo },
    });

    if (!existingTicket) {
      isUnique = true;
      return invoiceNo;
    }

    attempts++;
  }

  // Fallback: use timestamp if UUID collision occurs (extremely rare)
  return `${prefix}${Date.now().toString().slice(-8)}`;
};

export const createUserTicket = async (req: Request, res: Response) => {
  const transaction = await UserTicket.sequelize!.transaction();

  try {
    const { error } = userTicketSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const user = (req as any).user as { id: number; username: string };
    if (!user || !user.id) {
      await transaction.rollback();
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const counter = await Counter.findByPk(user.id);
    if (!counter) {
      await transaction.rollback();
      return res.status(404).json({ message: "Counter not found" });
    }

    if (counter.special) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: "Use special ticket route for special counters" });
    }

    // Generate unique invoice number
    const invoice_no = await generateUniqueInvoiceNo();

    const ticketData = {
      ...req.body,
      invoice_no,
      user_id: user.id,
      counter_id: user.id,
      status: "completed" as const,
    };

    // Create all related records within a transaction
    const [ticket, adminTicket] = await Promise.all([
      UserTicket.create(ticketData, { transaction }),
      Ticket.create(
        {
          price: ticketData.final_amount,
          dropdown_name: ticketData.vehicle_type,
          show_name: ticketData.show_name,
          counter_id: user.id,
          is_analytics: true, // CRITICAL: This ensures user tickets appear in analytics
        },
        { transaction }
      ),
    ]);

    await Transaction.create(
      {
        invoice_no: ticket.invoice_no,
        date: new Date(),
        adult_count: ticket.adults,
        child_count: 0,
        category: "Group",
        total_paid: ticket.final_amount,
        ticket_id: adminTicket.id,
        counter_id: user.id,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // Update guide stats (non-blocking, outside transaction)
    if (ticket.guide_name && ticket.guide_name !== "N/A") {
      updateGuideStats(ticket.guide_name, ticket.adults).catch((err) =>
        console.error("Error updating guide stats:", err)
      );
    }

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: {
        id: ticket.id,
        invoice_no: ticket.invoice_no,
        vehicle_type: ticket.vehicle_type,
        guide_name: ticket.guide_name,
        guide_number: ticket.guide_number,
        show_name: ticket.show_name,
        adults: ticket.adults,
        ticket_price: ticket.ticket_price,
        total_price: ticket.total_price,
        tax: ticket.tax,
        final_amount: ticket.final_amount,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error: any) {
    // Rollback transaction on error
    await transaction.rollback();

    console.error("Error in createUserTicket:", error);

    // Handle specific database errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Failed to create ticket due to duplicate data",
        error: "Please try again with different details",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Invalid ticket data",
        error: error.errors[0].message,
      });
    }

    // Generic error response
    res.status(500).json({
      message: "Internal server error while creating ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ... rest of the file remains the same
export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as {
      id: number;
      username: string;
      role: string;
    };
    const { startDate, endDate, search, page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Get today's date range
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Only show tickets from today

    let whereClause: any = {
      user_id: user.id,
      createdAt: {
        [Op.between]: [startOfToday, endOfToday],
      },
    };

    // If admin provides date range, use it instead (for admin viewing)
    if (user.role === "admin" && startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { guide_name: { [Op.iLike]: `%${search}%` } },
        { guide_number: { [Op.iLike]: `%${search}%` } },
        { invoice_no: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: tickets } = await UserTicket.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
    });

    res.json({
      tickets: tickets.map((ticket) => ({
        id: ticket.id,
        invoice_no: ticket.invoice_no,
        vehicle_type: ticket.vehicle_type,
        guide_name: ticket.guide_name,
        guide_number: ticket.guide_number,
        show_name: ticket.show_name,
        adults: ticket.adults,
        ticket_price: ticket.ticket_price,
        total_price: ticket.total_price,
        tax: ticket.tax,
        final_amount: ticket.final_amount,
        status: ticket.status,
        createdAt: ticket.createdAt,
      })),
      total: count,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
    });
  } catch (error) {
    console.error("Error in getUserTickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserTicket = async (req: Request, res: Response) => {
  const transaction = await UserTicket.sequelize!.transaction();

  try {
    const { id } = req.params;
    const user = (req as any).user as { id: number; role: string };
    const ticket = await UserTicket.findByPk(id);

    if (!ticket) {
      await transaction.rollback();
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (user.role !== "admin" && ticket.user_id !== user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: "Access denied" });
    }

    // Find and delete related transaction and admin ticket
    const transactionRecord = await Transaction.findOne({
      where: { invoice_no: ticket.invoice_no },
    });

    if (transactionRecord) {
      // Delete the admin ticket first
      await Ticket.destroy({
        where: { id: transactionRecord.ticket_id },
        transaction,
      });

      // Then delete the transaction
      await Transaction.destroy({
        where: { invoice_no: ticket.invoice_no },
        transaction,
      });
    }

    // Finally delete the user ticket
    await ticket.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in deleteUserTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
