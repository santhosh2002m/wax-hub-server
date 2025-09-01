// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthenticatedUser;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthenticatedUser;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const authorizeManager = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthenticatedUser;
  if (user.role !== "manager" && user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Manager or admin access required" });
  }
  next();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthenticatedUser;
  if (user.role !== "user" && user.role !== "admin") {
    return res.status(403).json({ message: "User or admin access required" });
  }
  next();
};

export const authorizeAdminOrUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthenticatedUser;
  if (user.role !== "admin" && user.role !== "user") {
    return res.status(403).json({ message: "Admin or user access required" });
  }
  next();
};

export const authorizeAdminOrManager = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthenticatedUser;
  if (user.role !== "admin" && user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "Admin or manager access required" });
  }
  next();
};
