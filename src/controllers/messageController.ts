import { Request, Response } from "express";
import twilio from "twilio";
import dotenv from "dotenv";
import Message from "../models/messageModel";
import Counter from "../models/counterModel";
import { Op } from "sequelize";
import { messageSchema } from "../schemas/messageSchema";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Twilio credentials are missing in .env");
}

const client = twilio(accountSid, authToken);

export const sendCustomMessage = async (req: Request, res: Response) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { phone, phones, message } = req.body as {
      phone?: string;
      phones?: string[];
      message: string;
    };

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!phone && (!phones || !phones.length)) {
      return res.status(400).json({ message: "Phone number(s) are required" });
    }

    const user = (req as any).user as { id: number; username: string };
    const counter_id = user.id;

    // Handle single phone number
    if (phone) {
      const whatsappPhone = `whatsapp:${phone.replace(/\D/g, "")}`;
      const messageRecord = await Message.create({
        phone,
        message,
        status: "pending",
        counter_id,
      });

      try {
        await client.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: whatsappPhone,
        });
        await messageRecord.update({ status: "sent", sentAt: new Date() });
        return res
          .status(200)
          .json({ message: "WhatsApp message sent successfully" });
      } catch (error) {
        await messageRecord.update({ status: "failed" });
        throw error;
      }
    }

    // Handle bulk send
    if (phones && phones.length > 0) {
      const results = [];
      for (const phoneNumber of phones) {
        const whatsappPhone = `whatsapp:${phoneNumber.replace(/\D/g, "")}`;
        const messageRecord = await Message.create({
          phone: phoneNumber,
          message,
          status: "pending",
          counter_id,
        });

        try {
          await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: whatsappPhone,
          });
          await messageRecord.update({ status: "sent", sentAt: new Date() });
          results.push({ phone: phoneNumber, status: "sent" });
        } catch (error) {
          await messageRecord.update({ status: "failed" });
          results.push({
            phone: phoneNumber,
            status: "failed",
            error: (error as any).message,
          });
        }
      }
      return res.status(200).json({
        message: "Bulk WhatsApp messages processed",
        results,
      });
    }
  } catch (error) {
    console.error("Error sending WhatsApp message(s):", error);
    res.status(500).json({ message: "Failed to send WhatsApp message(s)" });
  }
};

export const getSentMessages = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.sentAt = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }
    if (status) {
      where.status = status;
    }

    const messages = await Message.findAll({
      where,
      include: [{ model: Counter, as: "counter", attributes: ["username"] }],
      order: [["sentAt", "DESC"]],
    });

    res.status(200).json({
      total: messages.length,
      messages: messages.map((msg) => ({
        id: msg.id,
        phone: msg.phone,
        message: msg.message,
        status: msg.status,
        sentAt: msg.sentAt,
        sentBy: msg.counter?.username || "N/A",
      })),
    });
  } catch (error) {
    console.error("Error retrieving sent messages:", error);
    res.status(500).json({ message: "Failed to retrieve sent messages" });
  }
};
