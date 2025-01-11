import { Request, Response, NextFunction } from 'express';
import { ObjectHandler } from '../ObjectHandler';
import { Database } from 'sqlite';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export const checkOwnership = (db: Database, oh: ObjectHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        try {
            const decoded = jwt.verify(token, secret) as { id: string; email: string };
            const userFromTokenId = await oh.getUser(decoded.id, db);
            const userFromParamsId = await oh.getUserByMail(req.body.email, db);

            if(!userFromTokenId || !userFromParamsId) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (userFromTokenId?.name !== "admin" && userFromParamsId?.name !== userFromTokenId?.name) {
                return res.status(403).json({ message: 'Forbidden: You can only edit your own data' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};