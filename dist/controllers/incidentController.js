"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteIncident = exports.updateIncident = exports.getIncidentById = exports.getFilters = exports.getCounts = exports.getIncidents = exports.createIncident = void 0;
const incidentService = __importStar(require("../services/incidentService"));
const createIncident = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incident = yield incidentService.createIncident(req.body);
        res.status(201).json(incident);
    }
    catch (error) {
        next(error);
    }
});
exports.createIncident = createIncident;
const getIncidents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, sort = 'createdAt', order = 'desc', status, severity, search, service, cursor } = req.query;
        const take = Number(limit);
        const orderBy = { [sort]: order };
        const { incidents, nextCursor, totalCount } = yield incidentService.getIncidents({
            take,
            cursor: cursor,
            orderBy,
            status: status,
            severity: severity,
            search: search,
            service: service
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
    }
    catch (error) {
        next(error);
    }
});
exports.getIncidents = getIncidents;
const getCounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, severity, search, service } = req.query;
        const counts = yield incidentService.getIncidentCounts({
            status: status,
            severity: severity,
            search: search,
            service: service
        });
        res.json(counts);
    }
    catch (error) {
        next(error);
    }
});
exports.getCounts = getCounts;
const getFilters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = yield incidentService.getFilters();
        res.json(filters);
    }
    catch (error) {
        next(error);
    }
});
exports.getFilters = getFilters;
const getIncidentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const incident = yield incidentService.getIncidentById(id);
        if (!incident) {
            const error = new Error('Incident not found');
            error.status = 404;
            throw error;
        }
        res.json(incident);
    }
    catch (error) {
        next(error);
    }
});
exports.getIncidentById = getIncidentById;
const updateIncident = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const incident = yield incidentService.updateIncident(id, req.body);
        res.json(incident);
    }
    catch (error) {
        if (error.code === 'P2025') {
            const notFoundError = new Error('Incident not found');
            notFoundError.status = 404;
            return next(notFoundError);
        }
        next(error);
    }
});
exports.updateIncident = updateIncident;
const deleteIncident = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield incidentService.deleteIncident(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteIncident = deleteIncident;
