import { Request, Response } from "express";
export declare const getGuides: (req: Request, res: Response) => Promise<void>;
export declare const addGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteGuide: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=guideController.d.ts.map