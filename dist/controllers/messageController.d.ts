import { Request, Response } from "express";
export declare const getMessages: (req: Request, res: Response) => Promise<void>;
export declare const addMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=messageController.d.ts.map