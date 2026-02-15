"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIncidentSchema = exports.createIncidentSchema = void 0;
const zod_1 = require("zod");
exports.createIncidentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    service: zod_1.z.string().min(1, 'Service is required'),
    severity: zod_1.z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']),
    status: zod_1.z.enum(['OPEN', 'MITIGATED', 'RESOLVED']).optional(),
    owner: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
});
exports.updateIncidentSchema = exports.createIncidentSchema.partial();
