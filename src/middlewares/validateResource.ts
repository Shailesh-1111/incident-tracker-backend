import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

const validateResource = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e: any) {
        if (e instanceof ZodError) {
            return res.status(400).json({ error: e.issues });
        }
        return res.status(400).json({ error: (e as any).errors || 'Invalid request' });
    }
};

export default validateResource;
