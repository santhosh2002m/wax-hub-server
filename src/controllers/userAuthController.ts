import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchema";

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const user = await User.findOne({ where: { username } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, role } = req.body as {
      username: string;
      password: string;
      role?: "ticket_manager" | "admin";
    };

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || "ticket_manager",
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userChangePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: number; username: string };
    const userId = user.id;

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const userRecord = await User.findByPk(userId);
    if (
      !userRecord ||
      !bcrypt.compareSync(currentPassword, userRecord.password)
    ) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    userRecord.password = bcrypt.hashSync(newPassword, 10);
    await userRecord.save();

    res.status(200).json({
      message: "Password updated successfully",
      username: userRecord.username,
    });
  } catch (error) {
    console.error("Error in user change password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
