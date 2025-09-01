import { Request, Response } from "express";
export declare const addCounter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCounter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCounters: (req: Request, res: Response) => Promise<void>;
export declare const registerAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSpecialCounter: () => Promise<void>;
//# sourceMappingURL=counterController.d.ts.map