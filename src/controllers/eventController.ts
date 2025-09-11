import { Request, Response } from 'express';
import { processEventWithAI } from '../services/aiAdapter.js';
import { prisma } from '../lib/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import redis from '../lib/redis.js'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

export const simulateAndCreateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'No watchlists found to generate an event' });
        }

        const watchlist = await prisma.watchlist.findUnique({ where: { id: id } });

        if (!watchlist || watchlist.terms.length === 0) {
            return res.status(404).json({ error: `Watchlist with ID '${id}' not found or has no terms.` });
        }

        const randomTerm = watchlist.terms[Math.floor(Math.random() * watchlist.terms.length)];

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const generationPrompt = `Create a realistic, single-sentence security event description related to the term "${randomTerm}". The response should be a concise, single-sentence`;

        const result = await model.generateContent(generationPrompt);
        const dynamicEventText = result.response.text();

        const aiResult = await processEventWithAI(dynamicEventText);

        const newEvent = await prisma.event.create({
            data: {
                text: dynamicEventText,
                summary: aiResult.summary,
                severity: aiResult.severity,
                suggestedAction: aiResult.suggestedAction,
            }
        });

        await redis.del('events')

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event due to an internal error." });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    const cacheKey = 'events';

    try {
        const cachedEvents = await redis.get(cacheKey);

        if (cachedEvents) {
            console.log('Serving events from cache!');
            return res.status(200).json(JSON.parse(cachedEvents));
        }

        const sortedEvents = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        console.log('Serving events from Database!');

        await redis.setex(cacheKey, 60, JSON.stringify(sortedEvents));
        return res.status(200).json(sortedEvents);
    } catch (error) {
        console.error("Error fetching event:", error);
        return res.status(500).json({ message: "Failed to fetch event due to an internal error." });
    }

};