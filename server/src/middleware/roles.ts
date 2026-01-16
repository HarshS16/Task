import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

// Middleware to check if user is a subscriber
export function subscriberOnly(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.isSubscriber) {
        return res.status(403).json({ error: 'Subscription required for this feature' });
    }

    next();
}

// Middleware to check alert permissions - non-subscribers can't enable alerts
export function validateAlertPermission(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // If user is not a subscriber, force alertEnabled to false
    if (!req.user.isSubscriber && req.body.alertEnabled === true) {
        req.body.alertEnabled = false;
    }

    next();
}
