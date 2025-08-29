// src/controllers/ticketController.ts
import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import Transaction from "../models/transactionModel";
import { ticketSchema } from "../schemas/ticketSchema";

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error("Error in getTickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTicket = async (req: Request, res: Response) => {
  try {
    const { error } = ticketSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Create the ticket
    const ticket = await Ticket.create(req.body);

    // Create a corresponding transaction
    const user = (req as any).user as { id: number; username: string };
    const transaction = await Transaction.create({
      invoice_no: `TICKET${ticket.id.toString().padStart(4, "0")}`,
      date: new Date(),
      adult_count: ticket.category === "Adult" ? 1 : 0,
      child_count: ticket.category === "Child" ? 1 : 0,
      category: ticket.category,
      total_paid: ticket.price,
      ticket_id: ticket.id,
      counter_id: user.id, // Link to the authenticated user
    });

    res.status(201).json({
      ticket,
      transaction: {
        invoice_no: transaction.invoice_no,
        date: transaction.date,
        adult_count: transaction.adult_count,
        child_count: transaction.child_count,
        category: transaction.category,
        total_paid: transaction.total_paid,
        ticket_id: transaction.ticket_id,
        counter_id: transaction.counter_id,
      },
    });
  } catch (error) {
    console.error("Error in addTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = ticketSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Validate and convert id to number
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Update the ticket
    await Ticket.update(req.body, { where: { id: ticketId } });

    // Update or create a corresponding transaction
    const user = (req as any).user as { id: number; username: string };
    let transaction = await Transaction.findOne({
      where: { ticket_id: ticketId },
    });
    if (transaction) {
      await transaction.update({
        invoice_no: `TICKET${ticketId.toString().padStart(4, "0")}`,
        date: new Date(),
        adult_count: req.body.category === "Adult" ? 1 : 0,
        child_count: req.body.category === "Child" ? 1 : 0,
        category: req.body.category,
        total_paid: req.body.price,
        counter_id: user.id,
      });
    } else {
      transaction = await Transaction.create({
        invoice_no: `TICKET${ticketId.toString().padStart(4, "0")}`,
        date: new Date(),
        adult_count: req.body.category === "Adult" ? 1 : 0,
        child_count: req.body.category === "Child" ? 1 : 0,
        category: req.body.category,
        total_paid: req.body.price,
        ticket_id: ticketId,
        counter_id: user.id,
      });
    }

    res.json({
      message: "Ticket updated",
      transaction: {
        invoice_no: transaction.invoice_no,
        date: transaction.date,
        adult_count: transaction.adult_count,
        child_count: transaction.child_count,
        category: transaction.category,
        total_paid: transaction.total_paid,
        ticket_id: transaction.ticket_id,
        counter_id: transaction.counter_id,
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

    // Validate and convert id to number
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Delete associated transaction
    await Transaction.destroy({ where: { ticket_id: ticketId } });

    // Delete the ticket
    await Ticket.destroy({ where: { id: ticketId } });
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
