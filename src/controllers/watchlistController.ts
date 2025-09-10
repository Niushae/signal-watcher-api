import { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

export const createWatchlist = async (req: Request, res: Response) => {
    try {
        const { name, terms } = req.body;
        
        if (!name || !terms || !Array.isArray(terms) || terms.length === 0) {
            return res.status(400).json({ error: 'Name and a non-empty array of terms are required.' });
        }

        const newWatchlist = await prisma.watchlist.create({
            data: {
                name,
                terms,
            },
        });
        res.status(201).json(newWatchlist);
    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getWatchlists = async (req: Request, res: Response) => {
    try {
        const watchlists = await prisma.watchlist.findMany();
        res.status(200).json(watchlists);
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};