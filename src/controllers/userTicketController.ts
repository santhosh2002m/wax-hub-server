import { Request, Response } from "express";
import UserTicket from "../models/userticketModel";
import { userTicketSchema } from "../schemas/userSchema";
import { Op } from "sequelize";

export const createUserTicket = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = userTicketSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = (req as any).user as { id: number; username: string };
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Generate unique invoice number
    const generateInvoiceNo = async (): Promise<string> => {
      let nextId = 1;
      let invoiceNo = `TKT${nextId.toString().padStart(4, "0")}`;
      let existingTicket = await UserTicket.findOne({
        where: { invoice_no: invoiceNo },
      });

      // Keep incrementing until a unique invoice_no is found
      while (existingTicket) {
        nextId++;
        invoiceNo = `TKT${nextId.toString().padStart(4, "0")}`;
        existingTicket = await UserTicket.findOne({
          where: { invoice_no: invoiceNo },
        });
      }
      return invoiceNo;
    };

    const invoice_no = await generateInvoiceNo();

    const ticketData = {
      ...req.body,
      invoice_no,
      user_id: user.id,
      status: "completed" as const,
    };

    const ticket = await UserTicket.create(ticketData);

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
    console.error("Error in createUserTicket:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: `Failed to create ticket: ${error.errors[0].message}`,
        details: error.fields,
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: `Validation error: ${error.errors[0].message}`,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as {
      id: number;
      username: string;
      role: string;
    };

    let whereClause: any = {};
    if (user.role === "ticket_manager") {
      whereClause.user_id = user.id;
    }

    const { startDate, endDate, search } = req.query;

    if (startDate && endDate) {
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

    const tickets = await UserTicket.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
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
      total: tickets.length,
    });
  } catch (error) {
    console.error("Error in getUserTickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as { id: number; role: string };

    const ticket = await UserTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only allow admins or the user who created the ticket to delete it
    if (user.role !== "admin" && ticket.user_id !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await ticket.destroy();

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUserTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
