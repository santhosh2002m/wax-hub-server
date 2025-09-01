import { Request, Response } from "express";
export declare const getTodayOverview: (req: Request, res: Response) => Promise<void>;
export declare const getLast7Days: (req: Request, res: Response) => Promise<void>;
export declare const getLast30Days: (req: Request, res: Response) => Promise<void>;
export declare const getAnnualPerformance: (req: Request, res: Response) => Promise<void>;
export declare const getCalendarView: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCalendarTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCalendarTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=analyticsController.d.ts.map