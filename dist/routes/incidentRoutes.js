"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incidentController_1 = require("../controllers/incidentController");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post('/', (0, validateResource_1.default)(validation_1.createIncidentSchema), incidentController_1.createIncident);
router.get('/counts', incidentController_1.getCounts);
router.get('/filters', incidentController_1.getFilters);
router.get('/', incidentController_1.getIncidents);
router.get('/:id', incidentController_1.getIncidentById);
router.patch('/:id', (0, validateResource_1.default)(validation_1.updateIncidentSchema), incidentController_1.updateIncident);
router.delete('/:id', incidentController_1.deleteIncident);
exports.default = router;
