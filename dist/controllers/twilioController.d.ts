import { Request, Response } from "express";
export declare const sendSingleMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendBulkMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMessages: (req: Request, res: Response) => Promise<void>;
export declare const getMessageById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMessageStats: (req: Request, res: Response) => Promise<void>;
export declare const handleTwilioWebhook: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=twilioController.d.ts.map