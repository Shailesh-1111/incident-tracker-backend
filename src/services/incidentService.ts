import { PrismaClient, Incident, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface GetIncidentsParams {
    take?: number;
    cursor?: string;
    orderBy?: Prisma.IncidentOrderByWithRelationInput;
    status?: string;
    severity?: string;
    search?: string;
    service?: string;
}

// Helper to generate ID
const generateIncidentId = async (tx: Prisma.TransactionClient): Promise<string> => {
    const lastIncident = await tx.incident.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    let nextId = 'T0001';
    if (lastIncident && lastIncident.id.startsWith('T')) {
        const lastIdNum = parseInt(lastIncident.id.substring(1), 10);
        if (!isNaN(lastIdNum)) {
            nextId = `T${(lastIdNum + 1).toString().padStart(4, '0')}`;
        }
    }
    return nextId;
};

export const createIncident = async (data: Prisma.IncidentCreateInput): Promise<Incident> => {
    return prisma.$transaction(async (tx) => {
        const id = await generateIncidentId(tx);
        return tx.incident.create({
            data: {
                ...data,
                id,
            },
        });
    });
};

export const getIncidents = async ({ take = 10, cursor, orderBy = { createdAt: 'desc' }, status, severity, search, service }: GetIncidentsParams) => {
    const where: Prisma.IncidentWhereInput = { deletedAt: null };
    if (status) where.status = status as any;
    if (severity) where.severity = severity as any;
    if (service) where.service = { equals: service, mode: 'insensitive' };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { service: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [incidents, totalCount] = await prisma.$transaction([
        prisma.incident.findMany({
            take: take + 1, // Fetch one more to check if there's a next page
            cursor: cursor ? { id: cursor } : undefined,
            orderBy,
            where,
        }),
        prisma.incident.count({ where }),
    ]);

    let nextCursor: string | undefined = undefined;
    if (incidents.length > take) {
        const nextItem = incidents.pop();
        nextCursor = nextItem?.id;
    }

    return { incidents, nextCursor, totalCount };
};

export const getIncidentCounts = async ({ status, severity, search, service }: Omit<GetIncidentsParams, 'take' | 'cursor' | 'orderBy'>) => {
    const where: Prisma.IncidentWhereInput = { deletedAt: null };
    if (status) where.status = status as any;
    if (severity) where.severity = severity as any;
    if (service) where.service = { equals: service, mode: 'insensitive' };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { service: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [openCount, activeSev1Count, totalCount] = await prisma.$transaction([
        prisma.incident.count({ where: { AND: [where, { status: 'OPEN' }] } }),
        prisma.incident.count({ where: { AND: [where, { severity: 'SEV1' }, { status: { not: 'RESOLVED' } }] } }),
        prisma.incident.count({ where }),
    ]);

    return { openCount, activeSev1Count, totalCount };
};

export const getFilters = async () => {
    const where: Prisma.IncidentWhereInput = { deletedAt: null };
    const [services, severities, statuses] = await prisma.$transaction([
        prisma.incident.findMany({
            where,
            select: { service: true },
            distinct: ['service'],
            orderBy: { service: 'asc' }
        }),
        prisma.incident.findMany({
            where,
            select: { severity: true },
            distinct: ['severity'],
            orderBy: { severity: 'asc' }
        }),
        prisma.incident.findMany({
            where,
            select: { status: true },
            distinct: ['status'],
            orderBy: { status: 'asc' }
        }),
    ]);

    return {
        services: services.map(s => s.service),
        severities: severities.map(s => s.severity),
        statuses: statuses.map(s => s.status),
    };
};

export const getIncidentById = async (id: string): Promise<Incident | null> => {
    return prisma.incident.findFirst({ where: { id, deletedAt: null } });
};

export const updateIncident = async (id: string, data: Prisma.IncidentUpdateInput): Promise<Incident> => {
    // Check if exists and not deleted first to throw correct 404
    const exists = await prisma.incident.findFirst({ where: { id, deletedAt: null } });
    if (!exists) {
        throw { code: 'P2025' }; // Simulate Prisma not found error
    }
    return prisma.incident.update({
        where: { id },
        data,
    });
};

export const deleteIncident = async (id: string): Promise<Incident> => {
    return prisma.incident.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

// End of file
