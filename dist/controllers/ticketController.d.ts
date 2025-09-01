import { Request, Response } from "express";
export declare const getTickets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTicketById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ticketController.d.ts.map