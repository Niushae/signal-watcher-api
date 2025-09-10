import { Router } from 'express';
import { createWatchlist, getWatchlists } from '../controllers/watchlistController.js';

const router = Router();

router.post('/', createWatchlist);
router.get('/', getWatchlists);

export default router;