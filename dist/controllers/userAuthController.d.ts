import { Request, Response } from "express";
export declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userRegister: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userChangePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userAuthController.d.ts.map