// filepath: /Users/dirk/Documents/repos/mini-meco/server/src/middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
    user?: {
        role: string;
    };
}

export const authorize = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};