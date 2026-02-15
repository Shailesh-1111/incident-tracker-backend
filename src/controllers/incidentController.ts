import { Request, Response, NextFunction } from 'express';
import * as incidentService from '../services/incidentService';
import { Prisma } from '@prisma/client';

export const createIncident = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const incident = await incidentService.createIncident(req.body);
        res.status(201).json(incident);
    } catch (error) {
        next(error);
    }
};

export const getIncidents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = 10, sort = 'createdAt', order = 'desc', status, severity, search, service, cursor } = req.query;
        const take = Number(limit);
        const orderBy = { [sort as string]: order as 'asc' | 'desc' };

        const { incidents, nextCursor, totalCount } = await incidentService.getIncidents({
            take,
            cursor: cursor as string,
            orderBy,
            status: status as string,
            severity: severity as string,
            search: search as string,
            service: service as string
        });

        const totalPages = Math.ceil(totalCount / take);

        res.json({
            data: incidents,
            meta: {
                limit: take,
                nextCursor,
                totalCount,
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, severity, search, service } = req.query;
        const counts = await incidentService.getIncidentCounts({
            status: status as string,
            severity: severity as string,
            search: search as string,
            service: service as string
        });
        res.json(counts);
    } catch (error) {
        next(error);
    }
};

export const getFilters = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = await incidentService.getFilters();
        res.json(filters);
    } catch (error) {
        next(error);
    }
};

export const getIncidentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const incident = await incidentService.getIncidentById(id as string);
        if (!incident) {
            const error: any = new Error('Incident not found');
            error.status = 404;
            throw error;
        }
        res.json(incident);
    } catch (error) {
        next(error);
    }
};

export const updateIncident = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const incident = await incidentService.updateIncident(id as string, req.body);
        res.json(incident);
    } catch (error: any) {
        if (error.code === 'P2025') {
            const notFoundError: any = new Error('Incident not found');
            notFoundError.status = 404;
            return next(notFoundError);
        }
        next(error);
    }
};

export const deleteIncident = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await incidentService.deleteIncident(id as string);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
