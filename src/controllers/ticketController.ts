// FILE: controllers/ticketController.ts
import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import Transaction from "../models/transactionModel";
import {
  ticketCreateSchema,
  ticketUpdateSchema,
} from "../schemas/ticketSchema";
import { Op } from "sequelize";

interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
}

// FILE: controllers/ticketController.ts
// ... existing imports ...

export const getTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthenticatedUser;

    // If user is admin, show ONLY admin-created tickets (is_analytics: false)
    if (user.role === "admin") {
      const tickets = await Ticket.findAll({
        where: {
          is_analytics: false, // Only admin-created tickets
        },
        attributes: [
          "id",
          "price",
          "dropdown_name",
          "show_name",
          "createdAt",
          "is_analytics",
          "counter_id",
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(tickets);
    }

    // For non-admin users, show admin-created tickets and their own user-created tickets
    const tickets = await Ticket.findAll({
      where: {
        [Op.or]: [
          { is_analytics: false }, // Admin-created tickets
          { counter_id: user.id }, // Their own user-created tickets
        ],
      },
      attributes: [
        "id",
        "price",
        "dropdown_name",
        "show_name",
        "createdAt",
        "is_analytics",
        "counter_id",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tickets);
  } catch (error) {
    console.error("Error in getTickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ... rest of the file remains the same ...
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as AuthenticatedUser;
    const ticketId = parseInt(id, 10);

    if (isNaN(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    let whereClause: any = { id: ticketId };

    // If user is admin, restrict to admin-created tickets only
    if (user.role === "admin") {
      whereClause.is_analytics = false; // Only admin tickets
    } else {
      // For non-admin users, restrict access
      whereClause[Op.or] = [
        { is_analytics: false }, // Admin-created tickets
        { counter_id: user.id }, // Their own user-created tickets
      ];
    }

    const ticket = await Ticket.findOne({
      where: whereClause,
      attributes: [
        "id",
        "price",
        "dropdown_name",
        "show_name",
        "createdAt",
        "is_analytics",
        "counter_id",
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error in getTicketById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addTicket = async (req: Request, res: Response) => {
  try {
    const { error } = ticketCreateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const user = (req as any).user as AuthenticatedUser;
    const { dropdown_name, show_name, price } = req.body;

    // FIX: Only set is_analytics to true for user-created tickets
    const isAnalytics = user.role === "user"; // User-created tickets affect analytics

    const ticket = await Ticket.create({
      price: price,
      dropdown_name: dropdown_name,
      show_name: show_name,
      counter_id: user.id,
      is_analytics: false,
    } as any);

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: {
        id: ticket.id,
        price: ticket.price,
        dropdown_name: ticket.dropdown_name,
        show_name: ticket.show_name,
        is_analytics: ticket.is_analytics,
        counter_id: ticket.counter_id,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in addTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = ticketUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const user = (req as any).user as AuthenticatedUser;
    let whereClause: any = { id: ticketId };

    // If user is not admin, restrict access to their own tickets or admin tickets
    if (user.role !== "admin") {
      whereClause[Op.or] = [
        { is_analytics: false }, // Can update admin-created tickets
        { counter_id: user.id }, // Can update their own user-created tickets
      ];
    }

    const ticket = await Ticket.findOne({
      where: whereClause,
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.update(req.body);

    res.json({
      message: "Ticket updated successfully",
      ticket: {
        id: ticket.id,
        price: ticket.price,
        dropdown_name: ticket.dropdown_name,
        show_name: ticket.show_name,
        is_analytics: ticket.is_analytics,
        counter_id: ticket.counter_id,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in updateTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticketId = parseInt(id, 10);

    if (isNaN(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const user = (req as any).user as AuthenticatedUser;
    let whereClause: any = { id: ticketId };

    // If user is not admin, restrict deletion to their own tickets
    if (user.role !== "admin") {
      whereClause.counter_id = user.id; // Only allow deleting their own tickets
    }

    const ticket = await Ticket.findOne({
      where: whereClause,
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // DELETE related transactions instead of setting to null
    await Transaction.destroy({ where: { ticket_id: ticketId } });

    // Then delete the ticket
    await Ticket.destroy({ where: { id: ticketId } });

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
