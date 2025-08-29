// src/controllers/counterController.ts
import { Request, Response } from "express";
import Counter from "../models/counterModel";
import Transaction from "../models/transactionModel";
import bcrypt from "bcryptjs";
import { counterSchema } from "../schemas/counterSchema";

export const addCounter = async (req: Request, res: Response) => {
  try {
    const { error } = counterSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const counter = await Counter.create({
      username,
      password: hashedPassword,
      role: "manager", // Explicitly sets role to manager
    });
    res.status(201).json({
      id: counter.id,
      username: counter.username,
      role: counter.role,
      createdAt: counter.createdAt,
    });
  } catch (error) {
    console.error("Error in addCounter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCounter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const counter = await Counter.findByPk(id);
    if (!counter) return res.status(404).json({ message: "Counter not found" });

    // First, set counter_id to NULL in all associated transactions
    await Transaction.update(
      { counter_id: null },
      { where: { counter_id: id } }
    );

    // Then delete the counter
    await Counter.destroy({ where: { id } });
    res.json({ message: "Counter deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCounter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCounters = async (req: Request, res: Response) => {
  try {
    const counters = await Counter.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(counters);
  } catch (error) {
    console.error("Error in getCounters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { error } = counterSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = req.body;

    const existingUser = await Counter.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const validRoles = ["admin", "manager"];
    if (role && !validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be 'admin' or 'manager'" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const counter = await Counter.create({
      username,
      password: hashedPassword,
      role: role || "manager", // Default to manager if no role is provided
    });

    const message = `User created successfully (role: ${counter.role})`;
    res.status(201).json({
      message,
      username: counter.username,
      role: counter.role,
      createdAt: counter.createdAt,
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: number; username: string };
    const userId = user.id;

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    // Validate new password length
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const counter = await Counter.findByPk(userId);
    if (!counter || !bcrypt.compareSync(currentPassword, counter.password)) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    counter.password = bcrypt.hashSync(newPassword, 10);
    await counter.save();
    res.status(200).json({
      message: "Password updated successfully",
      username: counter.username,
      role: counter.role,
      createdAt: counter.createdAt,
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
