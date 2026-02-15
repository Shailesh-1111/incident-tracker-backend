import { z } from 'zod';

export const createIncidentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    service: z.string().min(1, 'Service is required'),
    severity: z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']),
    status: z.enum(['OPEN', 'MITIGATED', 'RESOLVED']).optional(),
    owner: z.string().optional(),
    summary: z.string().optional(),
});

export const updateIncidentSchema = createIncidentSchema.partial();
