import { Request, Response, NextFunction } from "express";
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeManager: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorizeUser: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeAdminOrUser: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeAdminOrManager: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorizeSpecialCounter: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map