import { Request, Response } from "express";
export declare const getUserGuides: (req: Request, res: Response) => Promise<void>;
export declare const getUserGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createUserGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUserGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTopPerformers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userGuideController.d.ts.map