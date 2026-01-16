import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buzdealz-secret-key-change-in-production';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    isSubscriber: boolean;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

// Optional auth middleware - doesn't fail if no auth, just sets user if present
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
            req.user = decoded;
        } catch {
            // Token invalid, continue without user
        }
    }
    next();
}
