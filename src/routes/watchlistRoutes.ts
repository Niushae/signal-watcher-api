import { Router } from 'express';
import { createWatchlist, getWatchlistById, getWatchlists } from '../controllers/watchlistController.js';

const router = Router();

router.post('/', createWatchlist);
router.get('/', getWatchlists);
router.get('/:id', getWatchlistById);

export default router;