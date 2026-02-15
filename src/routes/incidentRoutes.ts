import { Router } from 'express';
import { createIncident, getIncidents, getIncidentById, updateIncident, deleteIncident, getCounts, getFilters } from '../controllers/incidentController';
import validateResource from '../middlewares/validateResource';
import { createIncidentSchema, updateIncidentSchema } from '../utils/validation';

const router = Router();

router.post('/', validateResource(createIncidentSchema), createIncident);
router.get('/counts', getCounts);
router.get('/filters', getFilters);
router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.patch('/:id', validateResource(updateIncidentSchema), updateIncident);
router.delete('/:id', deleteIncident);

export default router;
