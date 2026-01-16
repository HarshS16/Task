import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { generateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6)
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parseResult.error.flatten()
            });
        }

        const { email, password } = parseResult.data;

        const user = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Simple password check (in production, use bcrypt)
        if (user[0].password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            isSubscriber: user[0].isSubscriber
        });

        res.json({
            success: true,
            token,
            user: {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name,
                isSubscriber: user[0].isSubscriber
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const parseResult = registerSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parseResult.error.flatten()
            });
        }

        const { email, name, password } = parseResult.data;

        // Check if email exists
        const existing = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const id = uuidv4();
        await db.insert(schema.users).values({
            id,
            email,
            name,
            password, // In production, hash with bcrypt
            isSubscriber: false
        });

        const token = generateToken({
            id,
            email,
            name,
            isSubscriber: false
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id,
                email,
                name,
                isSubscriber: false
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
