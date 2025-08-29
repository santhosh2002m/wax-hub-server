// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB";
import authRoutes from "./routes/authRoutes";
import counterRoutes from "./routes/counterRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import guideRoutes from "./routes/guideRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import cors from "cors";
import { readdirSync } from "fs";
import { join } from "path";
import sequelize from "./config/database";
import { DataTypes, QueryInterface } from "sequelize";
import messageRoutes from "./routes/messageRoutes"; // Add this import
import userAuthRoutes from "./routes/userAuthRoutes";
import userTicketRoutes from "./routes/userTicketRoutes";
import userGuideRoutes from "./routes/userGuideRoutes"; // Add this import

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database and run migrations
const runMigrations = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    const migrationsPath = join(__dirname, "migrations");
    const files = readdirSync(migrationsPath)
      .filter(
        (f) =>
          f.endsWith(".ts") &&
          f !== "run-migrations.ts" &&
          f !== "rollbackMigration.ts" // Add this exclusion
      )
      .sort();

    for (const file of files) {
      const migration = await import(join(migrationsPath, file));
      console.log(`Running migration: ${file}`);
      await migration.up(
        sequelize.getQueryInterface() as QueryInterface,
        DataTypes
      );
    }

    console.log("All migrations completed!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

runMigrations().then(() => {
  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/counters", counterRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/guides", guideRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/user/auth", userAuthRoutes);
  app.use("/api/user/tickets", userTicketRoutes);
  app.use("/api/user/guides", userGuideRoutes); // Add this line
  // src/app.ts (partial update)

  // Inside runMigrations().then() block, after other route definitions
  app.use("/api/messages", messageRoutes);
  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "OK", message: "Server is running" });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  // 404 handler
  app.use("*", (req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
