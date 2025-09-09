import { Router } from 'express';
import { getEvents, simulateAndCreateEvent } from '../controllers/eventController.js';

const router = Router();

router.get('/', getEvents);
router.post('/', simulateAndCreateEvent);

export default router;
