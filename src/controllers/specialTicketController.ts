import { Request, Response } from "express";
import SpecialTicket from "../models/SpecialTicket";
import { userTicketSchema } from "../schemas/userSchema";
import { Op } from "sequelize";
import Ticket from "../models/ticketModel";
import Transaction from "../models/transactionModel";
import Counter from "../models/counterModel";
import { v4 as uuidv4 } from "uuid";

interface AuthenticatedUser {
  id: number;
  username: string;
  role?: string;
}

export const createSpecialTicket = async (req: Request, res: Response) => {
  try {
    const { error } = userTicketSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const user = (req as any).user as AuthenticatedUser;
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const counter = await Counter.findByPk(user.id);
    if (!counter || !counter.special) {
      return res
        .status(403)
        .json({ message: "Access denied: Special counter required" });
    }

    const generateInvoiceNo = async (): Promise<string> => {
      return `SPT${uuidv4().slice(0, 8)}`;
    };

    const invoice_no = await generateInvoiceNo();
    const ticketData: any = {
      invoice_no,
      counter_id: user.id,
      status: "completed" as const,
      vehicle_type: req.body.vehicle_type || "Unknown",
      guide_name: req.body.guide_name || "N/A",
      guide_number: req.body.guide_number || "N/A",
      show_name: req.body.show_name || "N/A",
      adults: req.body.adults || 0,
      ticket_price: req.body.ticket_price || 0,
      total_price: req.body.total_price || 0,
      tax: req.body.tax || 0,
      final_amount: req.body.final_amount || 0,
    };

    const [ticket, adminTicket] = await Promise.all([
      SpecialTicket.create(ticketData),
      Ticket.create({
        price: ticketData.final_amount || 0,
        dropdown_name: ticketData.vehicle_type || "Unknown",
        show_name: ticketData.show_name || "N/A",
        counter_id: user.id,
      }),
    ]);

    await Transaction.create({
      invoice_no: ticket.invoice_no,
      date: new Date(),
      adult_count: ticketData.adults || 0,
      child_count: 0,
      category: "Special",
      total_paid: ticketData.final_amount || 0,
      ticket_id: adminTicket.id,
      counter_id: user.id,
    });

    res.status(201).json({
      message: "Special ticket created successfully",
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
    console.error("Error in createSpecialTicket:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: `Failed to create ticket: ${error.errors[0].message}`,
        details: error.fields,
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: `Validation error: ${error.errors[0].message}` });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// FILE: controllers/specialTicketController.ts
// ... existing imports ...

export const getSpecialTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthenticatedUser;
    const counter = await Counter.findByPk(user.id);
    if (!counter || !counter.special) {
      return res
        .status(403)
        .json({ message: "Access denied: Special counter required" });
    }

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

    // Only show tickets from today for regular users
    let whereClause: any = {
      counter_id: user.id,
      createdAt: {
        [Op.between]: [startOfToday, endOfToday],
      },
    };

    // If admin provides date range, use it instead
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

    const { count, rows: tickets } = await SpecialTicket.findAndCountAll({
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
    console.error("Error in getSpecialTickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ... rest of the file remains unchanged ...
