"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            return res.status(400).json({ error: e.issues });
        }
        return res.status(400).json({ error: e.errors || 'Invalid request' });
    }
};
exports.default = validateResource;
