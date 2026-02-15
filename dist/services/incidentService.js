"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncident = exports.updateIncident = exports.getIncidentById = exports.getFilters = exports.getIncidentCounts = exports.getIncidents = exports.createIncident = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper to generate ID
const generateIncidentId = (tx) => __awaiter(void 0, void 0, void 0, function* () {
    const lastIncident = yield tx.incident.findFirst({
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
});
const createIncident = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield generateIncidentId(tx);
        return tx.incident.create({
            data: Object.assign(Object.assign({}, data), { id }),
        });
    }));
});
exports.createIncident = createIncident;
const getIncidents = (_a) => __awaiter(void 0, [_a], void 0, function* ({ take = 10, cursor, orderBy = { createdAt: 'desc' }, status, severity, search, service }) {
    const where = { deletedAt: null };
    if (status)
        where.status = status;
    if (severity)
        where.severity = severity;
    if (service)
        where.service = { equals: service, mode: 'insensitive' };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { service: { contains: search, mode: 'insensitive' } },
        ];
    }
    const [incidents, totalCount] = yield prisma.$transaction([
        prisma.incident.findMany({
            take: take + 1, // Fetch one more to check if there's a next page
            cursor: cursor ? { id: cursor } : undefined,
            orderBy,
            where,
        }),
        prisma.incident.count({ where }),
    ]);
    let nextCursor = undefined;
    if (incidents.length > take) {
        const nextItem = incidents.pop();
        nextCursor = nextItem === null || nextItem === void 0 ? void 0 : nextItem.id;
    }
    return { incidents, nextCursor, totalCount };
});
exports.getIncidents = getIncidents;
const getIncidentCounts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ status, severity, search, service }) {
    const where = { deletedAt: null };
    if (status)
        where.status = status;
    if (severity)
        where.severity = severity;
    if (service)
        where.service = { equals: service, mode: 'insensitive' };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { service: { contains: search, mode: 'insensitive' } },
        ];
    }
    const [openCount, activeSev1Count, totalCount] = yield prisma.$transaction([
        prisma.incident.count({ where: { AND: [where, { status: 'OPEN' }] } }),
        prisma.incident.count({ where: { AND: [where, { severity: 'SEV1' }, { status: { not: 'RESOLVED' } }] } }),
        prisma.incident.count({ where }),
    ]);
    return { openCount, activeSev1Count, totalCount };
});
exports.getIncidentCounts = getIncidentCounts;
const getFilters = () => __awaiter(void 0, void 0, void 0, function* () {
    const where = { deletedAt: null };
    const [services, severities, statuses] = yield prisma.$transaction([
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
});
exports.getFilters = getFilters;
const getIncidentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.incident.findFirst({ where: { id, deletedAt: null } });
});
exports.getIncidentById = getIncidentById;
const updateIncident = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if exists and not deleted first to throw correct 404
    const exists = yield prisma.incident.findFirst({ where: { id, deletedAt: null } });
    if (!exists) {
        throw { code: 'P2025' }; // Simulate Prisma not found error
    }
    return prisma.incident.update({
        where: { id },
        data,
    });
});
exports.updateIncident = updateIncident;
const deleteIncident = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.incident.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
});
exports.deleteIncident = deleteIncident;
// End of file
