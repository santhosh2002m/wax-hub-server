// src/types/express.d.ts
import "express";
declare module "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        [key: string]: any;
      };
    }
  }
}
