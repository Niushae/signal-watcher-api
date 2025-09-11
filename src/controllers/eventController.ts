import { Request, Response } from 'express';
import { processEventWithAI } from '../services/aiAdapter.js';
import { prisma } from '../lib/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

export const simulateAndCreateEvent = async (req: Request, res: Response) => {
    try {
        const watchlists = await prisma.watchlist.findMany();

        if(watchlists.length === 0) {
            return res.status(400).json({ error: 'No watchlists found to generate an event'});
        }

        const randomWatchlist = watchlists[Math.floor(Math.random() * watchlists.length)];
        const randomTerm = randomWatchlist.terms[Math.floor(Math.random() * randomWatchlist.terms.length)]

        const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
        const generationPrompt =  `Create a realistic, single-sentence security event description related to the term "${randomTerm}". The response should be a concise, single-sentence`;

        const result = await model.generateContent(generationPrompt);
        const dynamicEventText = result.response.text();

        const aiResult = await processEventWithAI(dynamicEventText);

        if (!aiResult || !aiResult.summary || !aiResult.severity || !aiResult.suggestedAction) {
            return res.status(500).json({ message: "Failed to process event with AI. Invalid AI response." });
        }

        const newEvent = await prisma.event.create({
            data: {
                text: dynamicEventText,
                summary: aiResult.summary,
                severity: aiResult.severity,
                suggestedAction: aiResult.suggestedAction,
            }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event due to an internal error." });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const sortedEvents = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        res.status(200).json(sortedEvents);
    } catch(error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event due to an internal error." });
    }

};